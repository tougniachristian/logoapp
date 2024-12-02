// src/devoirs/dtos/create-soumission.dto.ts
import { IsString } from 'class-validator';

export class CreateSoumissionDto {
  @IsString()
  devoirId: string;

  @IsString()
  studentId: string;

  @IsString()
  file: string;
}
