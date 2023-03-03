import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// Providers
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// Models
import { TaskList } from '@module/board/models/list.entity';
import { ListCreateDto, ListUpdateDto } from '@module/board/models/list.dto';
import { TaskCreateDto } from '@module/board/models/task.dto';
// Services
import { TaskService } from '@module/board/services/task/task.service';
import { LabelService } from '@module/board/services/label/label.service';
import { CommentService } from '@module/board/services/comment/comment.service';
import { AttachmentService } from '@module/board/services/attachment/attachment.service';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(TaskList.name) private taskListModel: Model<TaskList>,
    private taskService: TaskService,
    private labelService: LabelService,
    private commentService: CommentService,
    private attachmentService: AttachmentService,
  ) {}

  async getAllByBoard(boardId: string) {
    try {
      const taskList = await this.taskListModel
        .find({ boardId })
        .populate('tasks')
        .populate({
          path: 'tasks',
          populate: [{ path: 'labels', model: 'Label' }],
        })
        .populate({
          path: 'tasks',
          populate: [{ path: 'members', model: 'User' }],
        });
      return {
        result: taskList,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(payload: ListCreateDto) {
    try {
      const newList = new this.taskListModel(payload);
      newList.createdAt = new Date();
      newList.updatedAt = new Date();
      await newList.save();
      return newList;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(listId: Types.ObjectId, payload: ListUpdateDto) {
    try {
      const listExist = await this.taskListModel.exists({
        _id: listId,
      });
      if (listExist) {
        const list = {
          ...payload,
          updatedAt: new Date(),
        };
        const updateList = await this.taskListModel
          .findByIdAndUpdate({ _id: listId }, { $set: list }, { new: true })
          .populate('tasks')
          .populate({
            path: 'tasks',
            populate: [{ path: 'labels', model: 'Label' }],
          })
          .populate({
            path: 'tasks',
            populate: [{ path: 'members', model: 'User' }],
          });
        return updateList;
      }
      throw new NotFoundException();
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Task list not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the task list is deleted ********//

  async remove(listId: Types.ObjectId) {
    try {
      await this.taskListModel.findByIdAndDelete(listId);
      await this.taskService.removeByTaskList(listId);
      await this.labelService.removeByTaskList(listId);
      await this.commentService.removeByTaskList(listId);
      await this.attachmentService.removeByTaskList(listId);
      return {
        message: 'Task list was deleted.',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the board is deleted ********//

  async removeByBoard(boardId: Types.ObjectId) {
    try {
      await this.taskListModel.deleteMany({ boardId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Handle assign and remove tasks from the list ********/

  async assign(payload: TaskCreateDto) {
    try {
      const listExist = await this.taskListModel.exists({
        _id: payload.listId,
      });
      if (listExist) {
        const newTask = await this.taskService.create(payload);
        const taskListUpdated = await this.taskListModel
          .findOneAndUpdate(
            { _id: payload.listId },
            { $addToSet: { tasks: newTask._id } },
            { new: true, upsert: true },
          )
          .populate('tasks')
          .populate({
            path: 'tasks',
            populate: [{ path: 'labels', model: 'Label' }],
          })
          .populate({
            path: 'tasks',
            populate: [{ path: 'members', model: 'User' }],
          });
        return taskListUpdated;
      }
      throw new NotFoundException();
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Task list not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeAssign(listId: Types.ObjectId, taskId: Types.ObjectId) {
    try {
      await this.taskService.remove(taskId);
      await this.labelService.removeByTask(taskId);
      await this.commentService.removeByTask(taskId);
      await this.attachmentService.removeByTask(taskId);
      const taskListUpdated = await this.taskListModel
        .findOneAndUpdate(
          { _id: listId },
          { $pull: { tasks: { $in: [taskId] } } },
          { new: true, upsert: true },
        )
        .populate('tasks')
        .populate({
          path: 'tasks',
          populate: [{ path: 'labels', model: 'Label' }],
        })
        .populate({
          path: 'tasks',
          populate: [{ path: 'members', model: 'User' }],
        });
      return taskListUpdated;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
