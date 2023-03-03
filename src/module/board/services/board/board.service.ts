import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// Providers
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// Models
import { Board } from '@module/board/models/board.entity';
import { BoardCreateDto, BoardUpdateDto } from '@module/board/models/board.dto';
import { PageQuery } from '@module/board/models/page.query';
// Services
import { UserService } from '@module/user/services/user/user.service';
import { ListService } from '@module/board/services/list/list.service';
import { TaskService } from '@module/board/services/task/task.service';
import { LabelService } from '@module/board/services/label/label.service';
import { CommentService } from '@module/board/services/comment/comment.service';
import { CloudinaryService } from '@module/cloudinary/services/cloudinary/cloudinary.service';
import { AttachmentService } from '@module/board/services/attachment/attachment.service';
import { BoardPermissionService } from '@module/board/services/board-permission/board-permission.service';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    private userService: UserService,
    private listService: ListService,
    private taskService: TaskService,
    private labelService: LabelService,
    private commentService: CommentService,
    private cloudinaryService: CloudinaryService,
    private boardPermissionService: BoardPermissionService,
    private attachmentService: AttachmentService,
  ) {}

  async getAll(query: PageQuery) {
    try {
      const count = await this.boardModel.estimatedDocumentCount();
      const result = await this.boardModel
        .find()
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .populate('members');
      return {
        pages: Math.ceil(count / query.limit),
        result,
        documentsPerPage: query.limit,
        total: count,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  searchBoards = async (query: PageQuery) => {
    try {
      const count = await this.boardModel.countDocuments({
        searchTitle: { $regex: query.search },
      });
      const result = await this.boardModel
        .find({ searchTitle: { $regex: query.search } })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .populate('members');
      return {
        pages: Math.ceil(count / query.limit),
        result,
        documentsPerPage: query.limit,
        total: count,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  };

  async getOne(id: string) {
    let board = null;
    try {
      board = await this.boardModel.findById(id).populate('members');
      return board;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(
    userId: Types.ObjectId,
    payload: BoardCreateDto,
    file: Express.Multer.File,
  ) {
    try {
      const changePayload = {
        title: payload.title,
        searchTitle: payload.title.toLowerCase(),
        description: payload.description,
        isPublic: false,
      };
      if (payload.isPublic === 'false') {
        changePayload.isPublic = false;
      } else {
        changePayload.isPublic = true;
      }
      if (file) {
        const { url, publicId } = await this.cloudinaryService.upload(file);
        const newBoard = new this.boardModel(changePayload);
        newBoard.createdAt = new Date();
        newBoard.updatedAt = new Date();
        newBoard.createdBy = userId;
        newBoard.cover = url;
        newBoard.coverId = publicId;
        await newBoard.save();
        const boardUpdated = await this.assign(userId, newBoard._id);
        await this.boardPermissionService.onCreateBoard(
          userId,
          boardUpdated._id,
        );
        return boardUpdated;
      }
      throw new BadRequestException('Cover was not sent');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(boardId: Types.ObjectId, payload: BoardUpdateDto) {
    let board = null;
    try {
      const updateBoard = {
        ...payload,
        updatedAt: new Date(),
      };
      board = await this.boardModel
        .findByIdAndUpdate(
          { _id: boardId },
          { $set: updateBoard },
          { new: true },
        )
        .populate('members');
      if (!board) {
        throw new NotFoundException();
      }
      return board;
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Board not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getMember(boardId: string, userId: Types.ObjectId) {
    try {
      const userIsAMember = await this.boardModel.find({
        _id: boardId,
        members: userId,
      });
      if (userIsAMember.length > 0) {
        return true;
      }
      return false;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the board is deleted ********//

  async remove(boardId: Types.ObjectId) {
    try {
      await this.boardModel.findByIdAndDelete(boardId);
      await this.listService.removeByBoard(boardId);
      await this.taskService.removeByBoard(boardId);
      await this.labelService.removeByBoard(boardId);
      await this.commentService.removeByBoard(boardId);
      await this.attachmentService.removeByBoard(boardId);
      return {
        message: 'Board was deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Handle assign and remove users to the board ********/

  async assign(userId: Types.ObjectId, boardId: Types.ObjectId) {
    try {
      const boardExist = await this.boardModel.exists({
        _id: boardId,
      });
      const userExist = await this.userService.exist(userId);
      if (boardExist && userExist) {
        const boardUpdated = await this.boardModel
          .findOneAndUpdate(
            { _id: boardId },
            { $addToSet: { members: userId } },
            { new: true, upsert: true },
          )
          .populate('members');
        await this.boardPermissionService.onAssignMemberOnBoard(
          userId,
          boardId,
        );
        return boardUpdated;
      }
      throw new NotFoundException();
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Board or User not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeAssign(userId: Types.ObjectId, boardId: Types.ObjectId) {
    try {
      const boardUpdated = await this.boardModel
        .findOneAndUpdate(
          { _id: boardId },
          { $pull: { members: { $in: [userId] } } },
          { new: true, upsert: true },
        )
        .populate('members');
      await this.boardPermissionService.delete(userId, boardId);
      return boardUpdated;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
