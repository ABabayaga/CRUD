import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @Post() create(@Body() dto: CreateTaskDto) { return this.tasks.create(dto); }
  @Get() findAll(@Query('q') q?: string) { return this.tasks.findAll(q); }
  @Get(':id') findOne(@Param('id') id: string) { return this.tasks.findOne(id); }
  @Put(':id') update(@Param('id') id: string, @Body() dto: UpdateTaskDto) { return this.tasks.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.tasks.remove(id); }
}
