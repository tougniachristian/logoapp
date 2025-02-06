import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';

@Schema({ timestamps: true })
export class Procedure extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true, type: [String] })
  commands: string[];

  @Prop({ required: true, type: [String] })
  params: string[];

  @Prop()
  lastUsed: Date;
}

export const ProcedureSchema = SchemaFactory.createForClass(Procedure);
