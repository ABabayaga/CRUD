// src/users/users.controller.ts
import {
  Body, Controller, Get, Post, Put, Delete, Param, Query, HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Get() 
  async findAll(@Query('q') q?: string) {
    return this.users.findAll(q);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}

@Controller()
export class PublicAuthController {
  constructor(private readonly users: UsersService) {}

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.users.validateLogin(dto.email, dto.password);
  }
}
