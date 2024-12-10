// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dtos/send-message.dto';
import { ClearRoomMessagesDto, DeleteMessageDto } from './dtos/moderation.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() sendMessageDto: SendMessageDto) {
    const message = await this.chatService.sendMessage(sendMessageDto);
    this.server.to(sendMessageDto.roomId).emit('message', message);
    return message;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    console.log(`Client ${client.id} joined room ${roomId}`);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(@MessageBody() deleteMessageDto: DeleteMessageDto) {
    const { messageId } = deleteMessageDto;
    await this.chatService.deleteMessage(messageId);

    // Émission à tous les clients de la suppression du message
    this.server.emit('messageDeleted', { messageId });
  }

  @SubscribeMessage('clearRoomMessages')
  async handleClearRoomMessages(
    @MessageBody() clearRoomMessagesDto: ClearRoomMessagesDto,
  ) {
    const { roomId } = clearRoomMessagesDto;
    await this.chatService.clearRoomMessages(roomId);

    // Notification à la salle de la suppression des messages
    this.server.to(roomId).emit('roomMessagesCleared', { roomId });
  }

  @SubscribeMessage('offer')
  handleOffer(client: any, payload: any) {
    // Relayer l'offre aux autres clients
    client.broadcast.emit('offer', payload);
  }

  @SubscribeMessage('answer')
  handleAnswer(client: any, payload: any) {
    // Relayer la réponse aux autres clients
    client.broadcast.emit('answer', payload);
  }

  @SubscribeMessage('candidate')
  handleCandidate(client: any, payload: any) {
    // Relayer les candidats ICE aux autres clients
    client.broadcast.emit('candidate', payload);
  }
}
