import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';

import * as connectRedis from 'connect-redis';
import Redis from 'ioredis';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);



  app.use(cookieParser());
  app.use(express.json());
  //กำหนด /api

  const api = `${process.env.PATH_API_NAME}/${process.env.VERSION_API}`;
  const api2 = `${process.env.PATH_API_NAME}`;
  app.setGlobalPrefix(process.env.VERSION_API ? api : api2);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ตัด properties ของข้อมูลที่ส่งเข้ามาที่ไม่ได้นิยามไว้ใน dto ออกไป
      forbidNonWhitelisted: true, // ตัวเลือกนี้จะทำงานคู่กับ whitelist โดยหากตั้งค่าเป็น true จะทำให้เกิด error ในกรณีนี้มี properties ใดที่ไม่ได้อยู่ใน whitelist ส่งเข้ามา
      transform: true, // ตัวเลือกนี้ทำให้เกิดการแปลงชนิดข้อมูลอัตโนมัติ ในข้อมูลจากภายนอกให้ตรงกับชนิดที่นิยามไว้ใน DTO
      exceptionFactory: (errors) => {
        // ตัวเลือกนี้ทำให้สามารถกำหนดรูปแบบของ error response เมื่อการตรวจ validation ล้มเหลวได้
        const messages = errors.map((error) => ({
          field: error.property,
          message: Object.values(error.constraints).join('. ') + '.',
        }));
        return new BadRequestException({ errors: messages });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 4000);

  console.log(
    ` Nest Local: http://localhost:${process.env.PORT ?? 4000}/${api}`,
  );
}
bootstrap();
