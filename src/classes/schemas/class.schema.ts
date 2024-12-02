import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Class extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  link: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacherId: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  students: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  coTeachers: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Assignment' }] })
  assignments: string[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);
