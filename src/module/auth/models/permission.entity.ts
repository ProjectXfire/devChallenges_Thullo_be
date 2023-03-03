import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Permission extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  key: string;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  updatedAt: Date;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);

export interface IPermission {
  name: string;
  key: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}
