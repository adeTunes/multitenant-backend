import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class VerifyEmailToken extends Document {
  @Prop({ required: true, type: mongoose.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  token: number;

  @Prop({ required: true })
  expiryDate: Date;
}

export const VerifyTokenSchema = SchemaFactory.createForClass(VerifyEmailToken);
