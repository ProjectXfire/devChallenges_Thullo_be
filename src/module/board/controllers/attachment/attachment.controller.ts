import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
// Providers
import { AuthGuard } from '@nestjs/passport';
// Models
import { Permission } from '@module/auth/models/permission';
// Services
import { AttachmentService } from '@module/board/services/attachment/attachment.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentCreateDto } from '@module/board/models/attachment.dto';
// Guards
import { PermissionGuard } from '@module/auth/guards/permission.guard';
// Decorators
import { Permissions } from '@module/auth/decorators/permission.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('attachment')
export class AttachmentController {
  constructor(private attachmentService: AttachmentService) {}

  @Post('upload/file')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.attachment.create])
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Body() payload: AttachmentCreateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attachmentService.uploadFile(payload, file);
  }

  @Get('list/:id')
  @HttpCode(HttpStatus.OK)
  getAllByTask(@Param('id') id: string) {
    return this.attachmentService.getAllByTask(id);
  }

  @Delete('delete/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.attachment.remove])
  delete(@Param('id') id: string, @Query('imageId') imageId: string) {
    return this.attachmentService.removeAttachment(id, imageId);
  }
}
