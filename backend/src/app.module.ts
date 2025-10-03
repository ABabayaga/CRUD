// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TasksModule } from './task/tasks.module';
import { CsrfController } from './csrf/csrf.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI!),
    UsersModule,
    TasksModule,
    AuthModule, 
  ],
  controllers: [CsrfController]
})
export class AppModule {}
