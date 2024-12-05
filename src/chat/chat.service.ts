import { Injectable, NotFoundException } from '@nestjs/common';
import { Message, MessageDocument } from './schemas/message.schema';
import { Room, RoomDocument } from './schemas/room.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRoomDto } from './dtos/create-room.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { User } from 'src/auth/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    @InjectModel(Room.name) private roomModel: Model<RoomDocument>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createRoom(
    createRoomDto: CreateRoomDto,
    ownerId: string,
  ): Promise<Room> {
    const room = new this.roomModel({ ...createRoomDto, owner: ownerId });
    return room.save();
  }

  // async addMemberToRoom(createRoomDto: CreateRoomDto): Promise<Room> {
  //   const room = new this.roomModel(createRoomDto);
  //   return room.save();
  // }

  async getRoomMessages(roomId: string): Promise<Message[]> {
    return this.messageModel.find({ roomId }).exec();
  }

  async sendMessage(sendMessageDto: SendMessageDto): Promise<Message> {
    const room = await this.roomModel.findById(sendMessageDto.roomId);
    const sender = await this.userModel.findById(sendMessageDto.senderId);
    const chekInside = [
      room.owner._id.toString(),
      ...room.participants.map((elm) => elm.toString()),
    ].includes(sender.id.toString());
    if (!chekInside) {
      throw new NotFoundException('Your are not allowed to send');
    }
    const message = new this.messageModel(sendMessageDto);
    return message.save();
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.messageModel.findByIdAndDelete(messageId).exec();
  }

  async clearRoomMessages(roomId: string): Promise<void> {
    await this.messageModel.deleteMany({ roomId }).exec();
  }
}
