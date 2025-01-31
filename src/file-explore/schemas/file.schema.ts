import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class File extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  size: number;
}

export const FileSchema = SchemaFactory.createForClass(File);
