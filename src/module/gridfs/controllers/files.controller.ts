import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../services/files.service';

@Controller('file')
export class FilesController {
  constructor(private fileService: FilesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile('file') file: Express.Multer.File) {
    const fileReponse = {
      originalname: file.originalname,
      mimetype: file.mimetype,
      id: file.id,
      filename: file.filename,
      metadata: file.metadata,
      bucketName: file.bucketName,
      chunkSize: file.chunkSize,
      size: file.size,
      md5: file.md5,
      uploadDate: file.uploadDate,
      contentType: file.contentType,
    };
    return fileReponse;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('info/:id')
  @HttpCode(HttpStatus.OK)
  async getFileInfo(@Param('id') id: string) {
    const file = await this.fileService.findInfo(id);
    const filestream = await this.fileService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file info',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been detected',
      file: file,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('download/:id')
  @HttpCode(HttpStatus.OK)
  async downloadFile(@Param('id') id: string, @Res() res) {
    const file = await this.fileService.findInfo(id);
    const filestream = await this.fileService.readStream(id);
    if (!filestream) {
      throw new HttpException(
        'An error occurred while retrieving file',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    res.header('Content-Type', file.contentType);
    res.header('Content-Disposition', 'attachment; filename=' + file.filename);
    return filestream.pipe(res);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('delete/:id')
  @HttpCode(HttpStatus.OK)
  async deleteFile(@Param('id') id: string) {
    const { fileInfo, fileStream } = await this.fileService.deleteFile(id);
    if (!fileStream) {
      throw new HttpException(
        'An error occurred during file deletion',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    return {
      message: 'File has been deleted',
      file: fileInfo,
    };
  }
}
