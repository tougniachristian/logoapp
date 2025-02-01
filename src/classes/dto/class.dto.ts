import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  teacherId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateClassDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsArray()
  @IsOptional()
  students?: string[];

  @IsArray()
  @IsOptional()
  coTeachers?: string[];
}
