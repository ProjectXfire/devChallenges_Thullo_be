import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// Providers
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// Models
import { Task } from '@module/board/models/task.entity';
import { TaskCreateDto, TaskUpdateDto } from '@module/board/models/task.dto';
import { LabelCreateDto } from '@module/board/models/label.dto';
// Services
import { UserService } from '@module/user/services/user/user.service';
import { LabelService } from '@module/board/services/label/label.service';
import { CloudinaryService } from '@module/cloudinary/services/cloudinary/cloudinary.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    private userService: UserService,
    private labelService: LabelService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getAllByTaskList(taskListId: Types.ObjectId) {
    try {
      const tasks = await this.taskModel.find({ listId: taskListId });
      return {
        result: tasks,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(payload: TaskCreateDto) {
    try {
      const newTask = new this.taskModel(payload);
      newTask.createdAt = new Date();
      newTask.updatedAt = new Date();
      newTask.description = '';
      newTask.coverId = '';
      newTask.countAttachments = 0;
      newTask.countComments = 0;
      await newTask.save();
      return newTask;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(taskId: Types.ObjectId, payload: TaskUpdateDto) {
    let updateTask = null;
    try {
      const task = {
        ...payload,
        updatedAt: new Date(),
      };
      updateTask = await this.taskModel
        .findByIdAndUpdate({ _id: taskId }, { $set: task }, { new: true })
        .populate('members')
        .populate('labels');
      if (!updateTask) {
        throw new NotFoundException();
      }
      return updateTask;
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Task not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Handle upload or update cover ********//

  async upload(
    taskId: Types.ObjectId,
    coverId: string,
    file: Express.Multer.File,
  ) {
    try {
      if (file && !coverId) {
        const { url, publicId } = await this.cloudinaryService.upload(file);
        const updatedTask = await this.update(taskId, {
          cover: url,
          coverId: publicId,
        });
        return updatedTask;
      }
      if (file && coverId) {
        const { url, publicId } = await this.cloudinaryService.upload(file);
        await this.cloudinaryService.destroyImage(coverId);
        const updatedTask = await this.update(taskId, {
          cover: url,
          coverId: publicId,
        });
        return updatedTask;
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when delete the task ********//

  async remove(taskId: Types.ObjectId) {
    try {
      const deletedTask = await this.taskModel.findByIdAndDelete(taskId);
      if (deletedTask.coverId) {
        await this.cloudinaryService.destroyImage(deletedTask.coverId);
      }
      return {
        message: 'Task was deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the task list is deleted ********//

  async removeByTaskList(listId: Types.ObjectId) {
    try {
      const tasksImages = await this.taskModel.find({ listId });
      await this.taskModel.deleteMany({ listId });
      tasksImages.forEach(async (task) => {
        if (task.coverId) {
          await this.cloudinaryService.destroyImage(task.coverId);
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the board is deleted ********//

  async removeByBoard(boardId: Types.ObjectId) {
    try {
      await this.taskModel.deleteMany({ boardId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Handle assign and remove users to the task ********/

  async assignUser(taskId: Types.ObjectId, userId: Types.ObjectId) {
    try {
      const existTask = await this.taskModel.exists({ _id: taskId });
      const existUser = await this.userService.exist(userId);
      if (existTask && existUser) {
        const taskUpdated = await this.taskModel
          .findOneAndUpdate(
            { _id: taskId },
            { $addToSet: { members: userId } },
            { new: true, upsert: true },
          )
          .populate('members')
          .populate('labels');
        return taskUpdated;
      }
      throw new NotFoundException();
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Task or user not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeAssigngUser(taskId: Types.ObjectId, userId: Types.ObjectId) {
    try {
      const taskUpdated = await this.taskModel
        .findOneAndUpdate(
          { _id: taskId },
          { $pull: { members: { $in: [userId] } } },
          { new: true, upsert: true },
        )
        .populate('members')
        .populate('labels');
      return taskUpdated;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Handle assign and remove labels to the task ********/

  async assignLabel(payload: LabelCreateDto) {
    try {
      const taskExist = await this.taskModel.exists({
        _id: payload.taskId,
      });
      if (taskExist) {
        const newLabel = await this.labelService.create(payload);
        const taskUpdated = await this.taskModel
          .findOneAndUpdate(
            { _id: payload.taskId },
            { $addToSet: { labels: newLabel._id } },
            { new: true, upsert: true },
          )
          .populate('members')
          .populate('labels');
        return taskUpdated;
      }
      throw new NotFoundException();
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Task not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async removeLabel(taskId: Types.ObjectId, labelId: Types.ObjectId) {
    try {
      await this.labelService.remove(labelId);
      const taskUpdated = await this.taskModel
        .findOneAndUpdate(
          { _id: taskId },
          { $pull: { labels: { $in: [labelId] } } },
          { new: true, upsert: true },
        )
        .populate('members')
        .populate('labels');
      return taskUpdated;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
