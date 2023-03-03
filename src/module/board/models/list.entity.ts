import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Models
import { Task } from './task.entity';

@Schema()
export class TaskList extends Document {
  @Prop({ required: true })
  title: string;
  @Prop({ type: [{ type: Types.ObjectId, ref: Task.name }] })
  tasks: Types.Array<Task | Types.ObjectId>;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  updatedAt: Date;
  // Reference
  @Prop({ required: true })
  boardId: Types.ObjectId;
}

export const TaskListSchema = SchemaFactory.createForClass(TaskList);
