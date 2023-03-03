import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// Providers
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// Models
import { Comment } from '@module/board/models/comment.entity';
import {
  CommentCreateDto,
  CommentUpdateDto,
} from '@module/board/models/comment.dto';
// Services
import { TaskService } from '@module/board/services/task/task.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    private taskService: TaskService,
  ) {}

  async getAllByTask(taskId: Types.ObjectId) {
    try {
      const comments = await this.commentModel
        .find({ taskId })
        .populate('createdBy');
      return {
        result: comments,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(createdBy: Types.ObjectId, payload: CommentCreateDto) {
    try {
      const newComment = new this.commentModel(payload);
      newComment.createdBy = createdBy;
      newComment.createdAt = new Date();
      newComment.updatedAt = new Date();
      await (await newComment.save()).populate('createdBy');
      const countComments = await this.commentModel.countDocuments({
        taskId: payload.taskId,
      });
      await this.taskService.update(payload.taskId, { countComments });
      return newComment;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateAllByTaskId(taskId: Types.ObjectId, payload: CommentUpdateDto) {
    let updatedComment = null;
    const comment = {
      ...payload,
      updatedAt: new Date(),
    };
    try {
      updatedComment = await this.commentModel.updateMany(
        { taskId },
        { $set: comment },
        { new: true },
      );
      if (!updatedComment) {
        throw new NotFoundException();
      }
      return updatedComment;
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Label not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Delete one comment ********//

  async remove(id: Types.ObjectId) {
    try {
      const commentDeleted = await this.commentModel.findByIdAndDelete(id);
      const countComments = await this.commentModel.countDocuments({
        taskId: commentDeleted.taskId,
      });
      await this.taskService.update(commentDeleted.taskId, {
        countComments,
      });
      return {
        message: 'Comment was deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the task is deleted ********//

  async removeByTask(taskId: Types.ObjectId) {
    try {
      await this.commentModel.deleteMany({ taskId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the task list is deleted ********//

  async removeByTaskList(listId: Types.ObjectId) {
    try {
      await this.commentModel.deleteMany({ listId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the board is deleted ********//

  async removeByBoard(boardId: Types.ObjectId) {
    try {
      await this.commentModel.deleteMany({ boardId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
