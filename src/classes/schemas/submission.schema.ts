import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Assignment } from 'src/assignments/schemas/assignment.schema';
import { User } from 'src/auth/schemas/user.schema';

@Schema({ timestamps: true })
export class Submission extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' })
  assignment: Assignment;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  student: User;

  @Prop({ required: true })
  content: string; // Texte ou script soumis

  @Prop()
  grade: number; // Note attribuée par l’enseignant

  @Prop()
  feedback: string; // Commentaire de l'enseignant

  @Prop({ default: false })
  isLate: boolean; // Statut : soumission en retard ou non
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
