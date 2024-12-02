// src/chat/dtos/create-room.dto.ts
import { IsString, IsArray } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsArray()
  participants: string[];
}
