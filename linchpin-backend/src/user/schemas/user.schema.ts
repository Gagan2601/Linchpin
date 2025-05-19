import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  aboutMe: string;

  @Prop()
  designation: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'AITool' }], default: [] })
  savedAIs: Types.ObjectId[];

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop()
  emailVerificationToken: string;

  @Prop()
  emailVerificationTokenExpires: Date;

  @Prop({ default: null, expires: 300 })
  autoDeleteAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
