import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// Models
import { BoardPermission } from '@module/board/models/board.permission.entity';
import { BoardPermissionDto } from '@module/board/models/board.permission.dto';

interface Payload {
  userId: Types.ObjectId;
  boardId: string;
  permissions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class BoardPermissionService {
  constructor(
    @InjectModel(BoardPermission.name)
    private modelBoardPermission: Model<BoardPermission>,
  ) {}

  async onCreateBoard(userId: Types.ObjectId, boardId: Types.ObjectId) {
    try {
      const payload: Payload = {
        userId,
        boardId: boardId.toString(),
        permissions: [new Types.ObjectId('62156b36c3301485dbe586ca')],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const adminPermission = new this.modelBoardPermission(payload);
      await adminPermission.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async onAssignMemberOnBoard(userId: Types.ObjectId, boardId: Types.ObjectId) {
    try {
      const payload: Payload = {
        userId,
        boardId: boardId.toString(),
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const adminPermission = new this.modelBoardPermission(payload);
      await adminPermission.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserPermissions(userId: Types.ObjectId, boardId: Types.ObjectId) {
    try {
      const userPermissions = await this.modelBoardPermission
        .findOne({
          userId,
          boardId,
        })
        .populate('permissions');
      return userPermissions;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(payload: BoardPermissionDto) {
    try {
      const updated = await this.modelBoardPermission.findOneAndUpdate(
        {
          userId: payload.userId,
          boardId: payload.boardId,
        },
        {
          $set: {
            permissions: payload.permissions,
          },
        },
        {
          new: true,
        },
      );
      return updated;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async delete(userId: Types.ObjectId, boardId: Types.ObjectId) {
    try {
      await this.modelBoardPermission.findOneAndDelete({
        userId,
        boardId,
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
