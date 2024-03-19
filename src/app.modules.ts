/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CommonModule, UserModule } from './modules';

@Module({
    imports:[
      ConfigModule.forRoot({isGlobal:true}),
      MongooseModule.forRoot(process.env.DB_CONNECTION),
      UserModule,CommonModule
    ],
    controllers:[],
    providers:[]
})
export class AppModule {}
