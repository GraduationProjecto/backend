/* eslint-disable prettier/prettier */
import { Controller, Post, Req, Res,Get, UseGuards} from '@nestjs/common';
import { UserService } from './user.services';
import { Request,Response } from 'express';
import { AuthGuard } from 'src/Guards/auth.guards';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) {}

  @Post('SignUp')
  async signUpController(
    @Req() req:Request,
    @Res() res:Response
  ){
    const response = await this.userService.SignUpService(req)
    res.status(201).json({
      message:'Registered  Successfully',
      response
    })
  }

  @Get('confirm-email')
  async confirmEmailController(
    @Req() req:Request,
    @Res() res:Response
  ){
    await this.userService.confirmEmailService(req)
    res.status(200).json({message:'Email verified successfully'})
  }

  @Post('login')
  async logInController(
    @Req() req:Request,
    @Res() res:Response
  ){
    const token = await this.userService.loginService(req)
    res.status(200).json({message:'LoggedIn successfully', data:token})
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfileController(
    @Req() req:Request,
    @Res() res:Response
  ){
    const profile = await this.userService.getProfileService(req)
    res.status(200).json({data:profile})
  }
}
