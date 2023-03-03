import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Models
import { User } from '@module/user/models/user.entity';
import { Label } from '@module/board/models/label.entity';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;
  @Prop()
  description: string;
  @Prop()
  cover: string;
  @Prop()
  coverId: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
  members: Types.Array<User | Types.ObjectId>;
  @Prop({ type: [{ type: Types.ObjectId, ref: Label.name }] })
  labels: Types.Array<Label | Types.ObjectId>;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  updatedAt: Date;
  @Prop({ required: true })
  countAttachments: number;
  @Prop({ required: true })
  countComments: number;
  // Reference
  @Prop({ required: true })
  listId: string;
  @Prop({ required: true })
  boardId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
