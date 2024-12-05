import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}
  @Post('room')
  createRoom(@Body() createRoomDto: CreateRoomDto, @Req() req) {
    return this.chatService.createRoom(createRoomDto, req.user.id);
  }

  //Récupérer les messages d'une discussion
  @Get('room/:roomId/messages')
  getRoomMessages(@Param('roomId') roomId: string) {
    return this.chatService.getRoomMessages(roomId);
  }

  // Supprimer un message spécifique
  @Delete('message/:messageId')
  async deleteMessage(@Param('messageId') messageId: string) {
    await this.chatService.deleteMessage(messageId);
    return { message: 'Message supprimé avec succès' };
  }

  @Post('message/:roomId/send')
  async sendMessage(
    @Param('roomId') roomId: string,
    @Req() req,
    @Body('content') content,
  ) {
    await this.chatService.sendMessage({
      roomId,
      senderId: req.user.id,
      content,
    });
    return { message: 'Message envoyer avec succès' };
  }

  // Supprimer tous les messages d'une salle
  @Delete('room/:roomId/messages')
  async clearRoomMessages(@Param('roomId') roomId: string) {
    await this.chatService.clearRoomMessages(roomId);
    return { message: 'Tous les messages de la salle ont été supprimés' };
  }
}
