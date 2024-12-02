// src/chat/dtos/moderation.dto.ts
import { IsString } from 'class-validator';

export class DeleteMessageDto {
  @IsString()
  messageId: string; // L'identifiant du message à supprimer
}

export class ClearRoomMessagesDto {
  @IsString()
  roomId: string; // L'identifiant de la salle
}
