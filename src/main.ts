/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.modules';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000,()=>console.log('Server is running'));
}
bootstrap();