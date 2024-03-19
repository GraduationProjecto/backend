/* eslint-disable prettier/prettier */
import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { models } from "src/DB/model-generation";
import { UserController } from "src/user/user.controller";
import { UserService } from "src/user/user.services";



@Module({
  imports:[models],
  controllers:[UserController],
  providers:[UserService,JwtService]
})

export class UserModule {}
