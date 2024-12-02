// src/devoirs/dtos/create-devoir.dto.ts
import { IsString, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreateDevoirDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  attachments?: string[];

  @IsString()
  classId: string;
}
