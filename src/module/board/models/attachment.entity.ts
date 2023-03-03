import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Attachment extends Document {
  @Prop()
  file: string;
  @Prop({ required: true })
  originalname: string;
  @Prop({ required: true })
  mimetype: string;
  @Prop({ required: true })
  fileType: string;
  @Prop()
  imageURL: string;
  @Prop()
  imageId: string;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  updatedAt: Date;
  @Prop({ required: true })
  taskId: Types.ObjectId;
  // Reference
  @Prop({ required: true })
  boardId: Types.ObjectId;
  @Prop({ required: true })
  listId: Types.ObjectId;
}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
