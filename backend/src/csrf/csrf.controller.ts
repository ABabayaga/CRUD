// src/csrf/csrf.controller.ts
import { Controller, Get, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';

@Controller()
export class CsrfController {
  @Get('csrf-token')
  getToken(@Req() req: Request, @Res() res: Response) {
    const token = (req as any).csrfToken();

    res.cookie('XSRF-TOKEN', token, {
      httpOnly: false,                
      sameSite: 'none',               
      secure: true,                    
      
    });

    return res.json({ csrfToken: token });
  }
}
