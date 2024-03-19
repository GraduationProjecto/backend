import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import * as mongoose from 'mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: mongoose.Model<User> , 
  private jwtService : JwtService) {}


  async findAll() {
    return await this.userModel.find();
  }
  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Incorrect password');
    }
    const payload = { email : user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
