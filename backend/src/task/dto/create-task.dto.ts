import { IsBoolean, IsDateString, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
export class CreateTaskDto {
  @IsString() @IsNotEmpty() @MinLength(3) title: string = '';
  @IsString() @IsOptional() description?: string;
  @IsBoolean() @IsOptional() done?: boolean;
  @IsDateString() @IsOptional() dueDate?: string;
}
