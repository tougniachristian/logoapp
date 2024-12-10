import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Class } from 'src/classes/schemas/class.schema';
import { Submission } from 'src/classes/schemas/submission.schema';

@Schema({ timestamps: true })
export class Assignment extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  dueDate: Date; // Date limite pour les devoirs

  @Prop({ type: [String], default: [] })
  files: string[]; // Liste des chemins des fichiers joints

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  class: Class;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }] })
  submissions: Submission[];
}

export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
