// src/users/users.service.ts
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

  private toPublic(u: any) {
    return { id: u.id ?? String(u._id), email: u.email };
  }

  private escapeRegex(input: string) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /** CREATE */
  async create(dto: CreateUserDto) {
    const exists = await this.userModel.exists({ email: dto.email });
    if (exists) throw new ConflictException('Email already registered');

    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    const user = await this.userModel.create({ email: dto.email, passwordHash });
    return this.toPublic(user);
  }

  /** LIST (supports ?q=) */
  async findAll(q?: string) {
    const filter = q
      ? { email: { $regex: this.escapeRegex(q), $options: 'i' } }
      : {};

    const users = await this.userModel
      .find(filter)
      .sort({ createdAt: -1 })
      .select('email') 
      .lean();

    return users.map((u) => this.toPublic(u));
  }

  /** READ by id */
  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('User not found');
    const user = await this.userModel.findById(id).select('email').lean();
    if (!user) throw new NotFoundException('User not found');
    return this.toPublic(user);
  }

  /** UPDATE (email e/ou password) */
  async update(id: string, dto: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new NotFoundException('User not found');

    if (dto.email) {
      const taken = await this.userModel.exists({ _id: { $ne: id }, email: dto.email });
      if (taken) throw new ConflictException('Email already registered');
    }

    const $set: Record<string, any> = {};
    if (dto.email) $set.email = dto.email;
    if (dto.password && dto.password.trim().length > 0) {
      const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
      $set.passwordHash = await bcrypt.hash(dto.password, rounds);
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, { $set }, { new: true })
      .select('email');

    if (!user) throw new NotFoundException('User not found');
    return this.toPublic(user);
  }

  /** DELETE */
  async remove(id: string) {
    if (!isValidObjectId(id)) throw new NotFoundException('User not found');
    const user = await this.userModel.findByIdAndDelete(id).select('email');
    if (!user) throw new NotFoundException('User not found');
    return this.toPublic(user);
  }

  async validateLogin(email: string, password: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Invalid credentials');

    return { message: 'login ok', user: this.toPublic(user) };
  }

  
  async findAuthByEmail(email: string) {
    return this.userModel.findOne({ email }).select('+passwordHash');
  }

  async ensureSeedUser(email: string, password: string) {
    const exists = await this.userModel.findOne({ email });
    if (exists) return;

    const rounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);
    const passwordHash = await bcrypt.hash(password, rounds);

    await this.userModel.create({
      email,
      passwordHash,
      role: 'admin',
      active: true,
    });
    console.log(`[seed] Usuário criado: ${email} / ${password}`);
  }
}
