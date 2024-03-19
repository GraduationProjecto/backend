import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './auth.gurd';
import { LoginUserDto } from './dto/signin-user-dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

 
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Post('/login')
   login(@Body() input : LoginUserDto) {
    return this.userService.login(input.email , input.password)
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  me(@Request() req : any) {
    return req.user
  }
}
