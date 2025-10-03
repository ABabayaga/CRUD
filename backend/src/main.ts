// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UsersService } from './users/users.service';
import * as dotenv from 'dotenv';

import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import type { Request } from 'express';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://crud-ten-ebon.vercel.app'],
    credentials: true,
  });

  app.use(cookieParser(process.env.CSRF_SECRET || 'csrf-secret'));

  // Exige CSRF em métodos "não seguros" (POST/PUT/PATCH/DELETE)
  app.use(
    csurf({
      cookie: {
        httpOnly: false,  // cliente precisa ler para mandar no header
        sameSite: 'none', // cross-site
        secure: true,     // necessário em https (Vercel/Render)
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.SEED_ON_BOOT === 'true') {
    const users = app.get(UsersService);
    await users.ensureSeedUser(
      process.env.SEED_EMAIL || 'admin@demo.com',
      process.env.SEED_PASSWORD || '123456'
    );
  }

  await app.listen(process.env.PORT ?? 3002, '0.0.0.0');
}
bootstrap();
