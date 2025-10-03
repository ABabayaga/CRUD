import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Task, TaskDocument } from './task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private model: Model<TaskDocument>) {}

  async create(dto: CreateTaskDto) {
    const data: any = { ...dto };
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    return this.model.create(data);
  }

  async findAll(q?: string) {
    const filter: FilterQuery<Task> = q ? { title: { $regex: q, $options: 'i' } } : {};
    return this.model.find(filter).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const t = await this.model.findById(id).lean();
    if (!t) throw new NotFoundException('Task not found');
    return t;
  }

  async update(id: string, dto: UpdateTaskDto) {
    const data: any = { ...dto };
    if (dto.dueDate) data.dueDate = new Date(dto.dueDate);
    const t = await this.model.findByIdAndUpdate(id, data, { new: true }).lean();
    if (!t) throw new NotFoundException('Task not found');
    return t;
  }

  async remove(id: string) {
    const r = await this.model.findByIdAndDelete(id).lean();
    if (!r) throw new NotFoundException('Task not found');
    return { ok: true };
  }
}
