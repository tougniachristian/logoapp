// src/chat/schemas/room.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import * as mongoose from 'mongoose';

export type RoomDocument = Room & Document;

@Schema({ timestamps: true })
export class Room {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: User;

  @Prop({ required: true })
  isPrivate: boolean; // Indicateur de conversation privée ou groupe

  @Prop({ required: true })
  name: string; // Nom de la salle

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    required: true,
  })
  participants: User[]; // Identifiants des participants
}

export const RoomSchema = SchemaFactory.createForClass(Room);
