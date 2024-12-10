import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum Roles {
  User = 'user',
  Admin = 'admin',
  Teacher = 'teacher',
  Co_teacher = 'co_teacher',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, default: Roles.User, enum: Roles }) // Roles: user, teacher, co-teacher
  role: string;

  @Prop({ default: false })
  isEmailVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
