// src/chat/chat.gateway.ts
import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
// import { UseGuards } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ClassesService } from 'src/classes/classes.service';
import { AuthService } from 'src/auth/auth.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Remplacez '*' par l'URL de votre frontend en production
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
// @UseGuards(JwtAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private classService: ClassesService,
    private userService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    const { classId, userId } = client.handshake.query;
    if (classId) {
      await client.join(classId as string);
    }
    if (userId) {
      await client.join(`${classId}-${userId}`);
    }
  }

  handleDisconnect(client: Socket) {
    const { classId, userId } = client.handshake.query;
    if (classId) {
      client.leave(classId as string);
    }
    if (userId) {
      client.leave(`${classId}-${userId}`);
    }
  }

  @SubscribeMessage('joinAssignment')
  handleJoinAssignment(client: Socket, assignmentId: string) {
    client.join(`assignment-${assignmentId}`);
  }

  @SubscribeMessage('leaveAssignment')
  handleLeaveAssignment(client: Socket, assignmentId: string) {
    client.leave(`assignment-${assignmentId}`);
  }

  @SubscribeMessage('updateSubmission')
  handleUpdateSubmission(
    client: Socket,
    payload: { assignmentId: string; content: string },
  ) {
    this.server
      .to(`assignment-${payload.assignmentId}`)
      .emit('submissionUpdated', {
        studentId: client.id,
        content: payload.content,
      });
  }

  @SubscribeMessage('shareScreen')
  handleShareScreen(
    client: Socket,
    payload: {
      assignmentId: string;
      submissionId: string;
      isAnonymous: boolean;
    },
  ) {
    this.server
      .to(`assignment-${payload.assignmentId}`)
      .emit('screenShared', payload);
  }

  @SubscribeMessage('updateGrade')
  handleUpdateGrade(
    client: Socket,
    payload: { assignmentId: string; submissionId: string; grade: number },
  ) {
    this.server
      .to(`assignment-${payload.assignmentId}`)
      .emit('gradeUpdated', payload);
  }

  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(
    client: Socket,
    payload: { classId: string; receiverId: string; content: string },
  ) {
    const senderId = client.handshake.query.userId as string;
    const newMessage = await this.chatService.createPrivateMessage(
      payload.classId,
      senderId,
      payload.receiverId,
      payload.content,
    );
    this.server
      .to(`${payload.classId}-${payload.receiverId}`)
      .to(`${payload.classId}-${senderId}`)
      .emit('privateMessage', newMessage);
  }

  @SubscribeMessage('classMessage')
  async handleClassMessage(
    client: Socket,
    payload: { classId: string; content: string },
  ) {
    const senderId = client.handshake.query.userId as string;
    const newMessage = await this.chatService.createClassMessage(
      payload.classId,
      senderId,
      payload.content,
    );
    this.server.to(payload.classId).emit('classMessage', newMessage);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    client: Socket,
    payload: { classId: string; messageId: string },
  ) {
    const userId = client.handshake.query.userId as string;
    const user = await this.userService.findById(userId);
    const classes = await this.classService.getClassById(
      payload.classId,
      userId,
    );
    if (user?.id !== classes?.teacherId?.id) {
      return;
    }
    await this.chatService.deleteClassMessage(payload.messageId);
    this.server.to(payload.classId).emit('deleteMessage', payload.messageId);
  }

  @SubscribeMessage('screenShare')
  handleScreenShare(
    client: Socket,
    payload: { classId: string; stream: MediaStream },
  ) {
    client.to(payload.classId).emit('screenShare', payload.stream);
  }

  @SubscribeMessage('stopScreenShare')
  handleStopScreenShare(client: Socket, payload: { classId: string }) {
    client.to(payload.classId).emit('stopScreenShare');
  }
}
