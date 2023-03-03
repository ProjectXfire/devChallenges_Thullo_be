import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// Providers
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// Models
import { Label } from '@module/board/models/label.entity';
import { LabelCreateDto, LabelUpdateDto } from '@module/board/models/label.dto';

@Injectable()
export class LabelService {
  constructor(@InjectModel(Label.name) private labelModel: Model<Label>) {}

  async getAllByTask(taskId: Types.ObjectId) {
    try {
      const labels = await this.labelModel.find({ taskId });
      return {
        result: labels,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async create(payload: LabelCreateDto) {
    try {
      const newLabel = new this.labelModel(payload);
      newLabel.createdAt = new Date();
      newLabel.updatedAt = new Date();
      await newLabel.save();
      return newLabel;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(labelId: Types.ObjectId, payload: LabelUpdateDto) {
    let updateLabel = null;
    try {
      const label = {
        ...payload,
        updatedAt: new Date(),
      };
      updateLabel = await this.labelModel.findByIdAndUpdate(
        { _id: labelId },
        { $set: label },
        { new: true },
      );
      if (!updateLabel) {
        throw new NotFoundException();
      }
      return updateLabel;
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Label not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateByTaskId(taskId: Types.ObjectId, payload: LabelUpdateDto) {
    let updateLabel = null;
    try {
      const label = {
        ...payload,
        updatedAt: new Date(),
      };
      updateLabel = await this.labelModel.updateMany(
        { taskId },
        { $set: label },
        { new: true },
      );
      if (!updateLabel) {
        throw new NotFoundException();
      }
      return updateLabel;
    } catch (error) {
      if (error.status === 404) {
        throw new NotFoundException('Label not found');
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when it is deleted from task ********//

  async remove(id: Types.ObjectId) {
    try {
      await this.labelModel.findByIdAndDelete(id);
      return {
        message: 'Label was deleted',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the task is deleted ********//

  async removeByTask(taskId: Types.ObjectId) {
    try {
      await this.labelModel.deleteMany({ taskId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the task list is deleted ********//

  async removeByTaskList(listId: Types.ObjectId) {
    try {
      await this.labelModel.deleteMany({ listId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the board is deleted ********//

  async removeByBoard(boardId: Types.ObjectId) {
    try {
      await this.labelModel.deleteMany({ boardId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
