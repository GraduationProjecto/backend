/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/DB/schemas/user.schema';
import { SendEmailService } from 'src/common/services/send-email.services';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: mongoose.Model<User> , 
    private jwtService: JwtService ,
    private sendEmailService: SendEmailService
  ) {}

  async findAll() {
    return await this.userModel.find();
  }
  
  async SignUpService(req:any){
    const {name,email,password} = req.body
    const isEmailExist = await this.userModel.findOne({email})
    if(isEmailExist){
      throw new ConflictException('This email already used')
    }
    const token = this.jwtService.sign({email},{secret:process.env.SECRET_KEY, expiresIn:'20s'})
    console.log(password)
    const hashedPassword = bcrypt.hashSync(password, 10)
    const confirmationLink = `${req.protocol}://${req.headers.host}/user/confirm-email?token=${token}`
    const isEmailSent = await this.sendEmailService.sendEmail({
            to:email,
            subject: `Welcome to our app 
                you have successfully signedUp`,
            message:`<h2>Please click on this link to verify account</h2>
                <a href="${confirmationLink}">Verify Email</a>`,
    })
    if(!isEmailSent){
      throw new InternalServerErrorException(`Email is not sent to ${email}`)
    }
    const newUser = await this.userModel.create({email,name,password:hashedPassword})
    return newUser
  }

  async confirmEmailService(req:any){
    const {token} = req.query
    if(!token){throw new Error('Invalid URL')}
    const data = this.jwtService.verify(token,{secret:process.env.SECRET_KEY})
    if(!data){throw new Error('Invalid token')}
    const user = await this.userModel.findOne({email:data.email,isEmailVerified:false})
    if(!user){throw new Error('Account not found')}
    user.isEmailVerified = true
    await user.save()
    return user
  }

  async loginService(req:any){
        const {email,password} = req.body
        const userFound = await this.userModel.findOne({email})
        if(!userFound){
            throw new BadRequestException("Invalid credentials")
        }
        const  isValidPassword = bcrypt.compareSync(password, userFound.password)
        if(!isValidPassword){
            throw new BadRequestException('Invalid credentials')
        }
        const token = this.jwtService.sign({email,id:userFound._id} , {secret:process.env.SECRET_KEY})
        return token
  }

  async getProfileService(req: any){
    const {_id} = req.authUser
    const user = await this.userModel.findById(_id)
    return user
  }
}
