import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Models
import { User } from '@module/user/models/user.entity';
import { IPermission, Permission } from '@module/auth/models/permission.entity';
import { Board } from './board.entity';

@Schema()
export class BoardPermission extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: User | Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: Board.name, required: true })
  boardId: Board | Types.ObjectId;
  @Prop({ type: [{ type: Types.ObjectId, ref: Permission.name }] })
  permissions: Types.Array<Permission | Types.ObjectId>;
  @Prop({ required: true })
  createdAt: Date;
  @Prop({ required: true })
  updatedAt: Date;
}

export const BoardPermissionSchema =
  SchemaFactory.createForClass(BoardPermission);

export interface IBoardPermission {
  userId: string;
  boardId: string;
  permissions: IPermission[];
  createdAt: Date;
  updatedAt: Date;
}
