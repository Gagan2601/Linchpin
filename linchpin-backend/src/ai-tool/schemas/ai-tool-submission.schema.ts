import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { AITool } from './ai-tool.schema';

@Schema({ timestamps: true })
export class AIToolSubmission {
  @Prop({ type: AITool, required: true })
  toolData: Partial<AITool>;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  submittedBy: Types.ObjectId;

  @Prop({
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'approved' | 'rejected';

  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  reviewedBy?: Types.ObjectId;

  @Prop({ default: null })
  reviewedAt?: Date;

  @Prop({ default: null })
  rejectionReason?: string;

  @Prop({
    type: [
      {
        type: {
          text: String,
          isRead: { type: Boolean, default: false },
          createdAt: { type: Date, default: Date.now },
        },
      },
    ],
    default: [],
  })
  notifications: {
    text: string;
    isRead: boolean;
    createdAt: Date;
  }[];
}

export type AIToolSubmissionDocument = AIToolSubmission & Document;
export const AIToolSubmissionSchema =
  SchemaFactory.createForClass(AIToolSubmission);
