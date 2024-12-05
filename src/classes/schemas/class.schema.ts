import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Assignment } from 'src/assignments/schemas/assignment.schema';
import { User } from 'src/auth/schemas/user.schema';

@Schema({ timestamps: true })
export class Class extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  link: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  teacherId: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  students: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  coTeachers: User[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }] })
  assignments: Assignment[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);
