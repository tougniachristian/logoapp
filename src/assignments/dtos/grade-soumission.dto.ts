// src/devoirs/dtos/grade-soumission.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GradeSoumissionDto {
  @IsNumber()
  grade: number;

  @IsOptional()
  @IsString()
  feedback?: string;
}
