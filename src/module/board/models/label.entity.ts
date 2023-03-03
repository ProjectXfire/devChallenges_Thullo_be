import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Label extends Document {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  color: string;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  updatedAt: Date;
  // Reference
  @Prop({ required: true })
  boardId: Types.ObjectId;
  @Prop({ required: true })
  listId: Types.ObjectId;
  @Prop({ required: true })
  taskId: Types.ObjectId;
}

export const LabelSchema = SchemaFactory.createForClass(Label);
