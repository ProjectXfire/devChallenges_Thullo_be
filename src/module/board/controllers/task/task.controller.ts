import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
// Models
import {
  TaskUpdateDto,
  TaskMember,
  RemoveLabel,
} from '@module/board/models/task.dto';
import { LabelCreateDto } from '@module/board/models/label.dto';
import { Permission } from '@module/auth/models/permission';
// Services
import { TaskService } from '@module/board/services/task/task.service';
// Guards
import { PermissionGuard } from '@module/auth/guards/permission.guard';
// Decorators
import { Permissions } from '@module/auth/decorators/permission.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get('list/:id')
  @HttpCode(HttpStatus.OK)
  getAll(@Param('id') id) {
    return this.taskService.getAllByTaskList(id);
  }

  @Put('update/:id')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.edit])
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id, @Body() payload: TaskUpdateDto) {
    return this.taskService.update(id, payload);
  }

  @Put('update/list/:id')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.list.edit])
  @HttpCode(HttpStatus.OK)
  updateList(@Param('id') id, @Body() payload: TaskUpdateDto) {
    return this.taskService.update(id, payload);
  }

  @Delete('delete/:id')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.remove])
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id) {
    return this.taskService.remove(id);
  }

  //******** Handle upload or update cover ********//

  @Put('upload/:id')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.edit])
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  upload(
    @Param('id') id: Types.ObjectId,
    @Body('coverId') coverId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.taskService.upload(id, coverId, file);
  }

  //******** Handle assign and remove users to the task ********/

  @Put('assign/member')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.responsable.assign])
  @HttpCode(HttpStatus.OK)
  assignMember(@Body() payload: TaskMember) {
    return this.taskService.assignUser(payload.taskId, payload.userId);
  }

  @Put('remove/member')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.responsable.remove])
  @HttpCode(HttpStatus.OK)
  removeMember(@Body() payload: TaskMember) {
    return this.taskService.removeAssigngUser(payload.taskId, payload.userId);
  }

  //******** Handle assign and remove labels to the task ********/

  @Put('assign/label')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.label.create])
  @HttpCode(HttpStatus.OK)
  assignLabel(@Body() payload: LabelCreateDto) {
    return this.taskService.assignLabel(payload);
  }

  @Put('remove/label')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.label.remove])
  @HttpCode(HttpStatus.OK)
  removeLabel(@Body() payload: RemoveLabel) {
    return this.taskService.removeLabel(payload.taskId, payload.labelId);
  }
}
