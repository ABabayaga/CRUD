// src/csrf/csrf.controller.ts
import { Controller, Get, Req } from '@nestjs/common';
import type { Request } from 'express';

@Controller()
export class CsrfController {
  @Get('csrf-token')
  getToken(@Req() req: Request) {
    const token = (req as any).csrfToken(); 
    return { csrfToken: token };
  }
}
