// src/chat/schemas/message.schema.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop({ required: true })
  roomId: string; // Identifiant de la salle de discussion

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  senderId: User; // Identifiant de l'expéditeur

  @Prop({ required: true })
  content: string; // Contenu du message

  @Prop({ default: false })
  isRead: boolean; // Statut de lecture du message
}

export const MessageSchema = SchemaFactory.createForClass(Message);
