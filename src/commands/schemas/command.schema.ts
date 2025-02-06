import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Schema({ timestamps: true })
export class Command extends Document {
  @Prop({ required: true })
  command: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;
}

export const CommandSchema = SchemaFactory.createForClass(Command);
