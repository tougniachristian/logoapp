import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Room, RoomSchema } from './schemas/room.schema';
import { Message, MessageSchema } from './schemas/message.schema';
import { User, UserSchema } from 'src/auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Room.name, schema: RoomSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
