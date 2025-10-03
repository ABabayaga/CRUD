// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
  ) {}

  async validateLogin(email: string, password: string) {

    const user = await this.users.findAuthByEmail(email); 
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return {
      ok: true,
      user: { id: String(user.id ?? user._id), email: user.email },
    };
  }
}
