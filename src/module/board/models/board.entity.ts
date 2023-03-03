import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Models
import { User } from '@module/user/models/user.entity';

@Schema()
export class Board extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: User | Types.ObjectId;
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  searchTitle: string;
  @Prop()
  description: string;
  @Prop({ required: true })
  cover: string;
  @Prop({ required: true })
  coverId: string;
  @Prop({ required: true })
  isPublic: boolean;
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  members: Types.Array<User | Types.ObjectId>;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  updatedAt: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
