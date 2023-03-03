import { Injectable, InternalServerErrorException } from '@nestjs/common';
// Providers
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
// Models
import { Attachment } from '@module/board/models/attachment.entity';
import { AttachmentCreateDto } from '@module/board/models/attachment.dto';
// Services
import { CloudinaryService } from '@module/cloudinary/services/cloudinary/cloudinary.service';
import { TaskService } from '@module/board/services/task/task.service';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectModel(Attachment.name) private attachmentModel: Model<Attachment>,
    private cloudinaryService: CloudinaryService,
    private taskService: TaskService,
  ) {}

  async getAllByTask(taskId: string) {
    try {
      const attachments = await this.attachmentModel.find({ taskId });
      return {
        result: attachments,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async uploadFile(payload: AttachmentCreateDto, file: Express.Multer.File) {
    try {
      const { taskId, boardId, listId, fileType } = payload;
      let payloadChanged;
      if (fileType === 'file') {
        payloadChanged = {
          file: file.buffer.toString('base64'),
          taskId,
          boardId,
          listId,
          originalname: file.originalname,
          mimetype: file.mimetype,
          fileType,
          imageURL: '',
          imageId: '',
        };
      }
      if (fileType === 'image') {
        const { url, publicId } = await this.cloudinaryService.upload(file);
        payloadChanged = {
          file: '',
          taskId,
          boardId,
          listId,
          originalname: file.originalname,
          mimetype: file.mimetype,
          fileType,
          imageURL: url,
          imageId: publicId,
        };
      }
      const attachment = new this.attachmentModel(payloadChanged);
      attachment.createdAt = new Date();
      attachment.updatedAt = new Date();
      await attachment.save();
      const countAttachments = await this.attachmentModel.countDocuments({
        taskId,
      });
      await this.taskService.update(taskId, { countAttachments });
      return attachment;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when it is deleted from task ********//

  async removeAttachment(id: string, imageId: string) {
    try {
      if (imageId) {
        await this.cloudinaryService.destroyImage(imageId);
      }
      const deleteItem = await this.attachmentModel.findByIdAndDelete(id);
      const countAttachments = await this.attachmentModel.countDocuments({
        taskId: deleteItem.taskId,
      });
      await this.taskService.update(deleteItem.taskId, { countAttachments });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the task is deleted ********//

  async removeByTask(taskId: Types.ObjectId) {
    try {
      await this.attachmentModel.deleteMany({ taskId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the task list is deleted ********//

  async removeByTaskList(listId: Types.ObjectId) {
    try {
      await this.attachmentModel.deleteMany({ listId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  //******** Only when the board is deleted ********//

  async removeByBoard(boardId: Types.ObjectId) {
    try {
      await this.attachmentModel.deleteMany({ boardId });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
