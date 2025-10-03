// src/auth/auth.controller.ts
import { Controller, Post, Body, HttpCode, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    const { user } = await this.auth.validateLogin(dto.email, dto.password);
    return { ok: true, user };
  }

  @HttpCode(200)
  @Post('logout')
  logout() {
    return { ok: true };
  }
}
