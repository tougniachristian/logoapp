// src/chat/dtos/send-message.dto.ts
import { IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  roomId: string;

  @IsString()
  senderId: string;

  @IsString()
  content: string;
}
