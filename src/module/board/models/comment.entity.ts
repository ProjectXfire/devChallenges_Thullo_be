import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Models
import { User } from '@module/user/models/user.entity';

@Schema()
export class Comment extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: User | Types.ObjectId;
  @Prop({ required: true })
  comment: string;
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

export const CommentSchema = SchemaFactory.createForClass(Comment);
