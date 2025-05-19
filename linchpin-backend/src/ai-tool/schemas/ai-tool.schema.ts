import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AITool {
  @Prop({ required: true })
  name: string;

  @Prop([String])
  categories: string[];

  @Prop()
  description: string;

  @Prop()
  website: string;

  @Prop()
  logo_url: string;

  @Prop()
  release_year: number;

  @Prop()
  skill_level: string;

  @Prop({ default: false })
  trending: boolean;

  @Prop([String])
  founders: string[];

  @Prop({ default: null })
  total_rating: number;

  @Prop({
    type: [
      new mongoose.Schema(
        {
          userId: { type: Types.ObjectId, ref: 'User', required: true },
          username: { type: String, required: true },
          designation: { type: String, required: true },
          rating: { type: Number, required: true, min: 1, max: 5 },
          comment: { type: String, required: true },
        },
        { _id: true },
      ),
    ],
    default: [],
  })
  reviews: {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    username: string;
    designation: string;
    rating: number;
    comment: string;
  }[];

  @Prop({
    type: {
      plan: String,
      details: [
        {
          type: { type: String },
          features: String,
        },
      ],
    },
  })
  pricing: any;
}

export type AIToolDocument = AITool & Document;
export const AIToolSchema = SchemaFactory.createForClass(AITool);
