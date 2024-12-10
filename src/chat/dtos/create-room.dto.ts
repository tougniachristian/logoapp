// src/chat/dtos/create-room.dto.ts
import { IsString, IsArray, IsBoolean } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsArray()
  participants: string[];

  @IsBoolean()
  isPrivate: boolean;
}
