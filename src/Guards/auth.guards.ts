/* eslint-disable prettier/prettier */
import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/DB/schemas/user.schema";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService:JwtService
    ){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        let {token} = req.headers
        if(!token){throw new BadRequestException('Please login first')}
        if(!token.startsWith(process.env.TOKEN_PREFIX)){
            throw new BadRequestException('Invalid token type')
        }
        token = token.split(process.env.TOKEN_PREFIX)[1]
        const payload = this.jwtService.verify(token , {secret:process.env.SECRET_KEY})
        if(!payload || !payload.id){
            throw new BadRequestException('Invalid token')
        }
        const user = await this.userModel.findById(payload.id).select('-password -isEmailVerified')
        if(!user){
            throw new BadRequestException('Please sign up first')
        }
        req['authUser'] = user
        return req
    }
}