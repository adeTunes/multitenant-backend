import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tenant extends Document {
  @Prop({ required: true })
  company_name: string;

  @Prop({default: null})
  company_logo: string;

  @Prop({ required: true, unique: true })
  company_alias: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
