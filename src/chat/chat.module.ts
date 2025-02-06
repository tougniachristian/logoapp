import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';
import { ClassesModule } from 'src/classes/classes.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrivateMessage, PrivateMessageSchema } from './schemas/private.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
      { name: PrivateMessage.name, schema: PrivateMessageSchema },
    ]),
    AuthModule,
    ClassesModule,
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
