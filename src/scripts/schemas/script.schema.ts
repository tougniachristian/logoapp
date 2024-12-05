import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Script extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, default: false })
  isPublic: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ default: null })
  sharedLink: string | null; // Lien unique pour partager le script.

  @Prop({ default: null })
  importedFrom: string | null; // Identifiant du script source en cas d'importation.
}

export const ScriptSchema = SchemaFactory.createForClass(Script);
