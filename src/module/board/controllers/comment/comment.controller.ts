import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Request,
  Delete,
  Post,
  Put,
} from '@nestjs/common';
import { Types } from 'mongoose';
// Models
import {
  CommentCreateDto,
  CommentUpdateDto,
} from '@module/board/models/comment.dto';
import { AuthGuard } from '@nestjs/passport';
// Services
import { CommentService } from '@module/board/services/comment/comment.service';
import { Token } from '@module/auth/models/token';

@UseGuards(AuthGuard('jwt'))
@Controller('comment')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Get('list/:id')
  @HttpCode(HttpStatus.OK)
  getAllByTask(@Param('id') id) {
    return this.commentService.getAllByTask(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req, @Body() payload: CommentCreateDto) {
    const user: Token = req.user;
    return this.commentService.create(user.sub, payload);
  }

  @Put('update/all/:id')
  @HttpCode(HttpStatus.OK)
  updateAllByTaskId(
    @Param('id') id: Types.ObjectId,
    @Body() payload: CommentUpdateDto,
  ) {
    return this.commentService.updateAllByTaskId(id, payload);
  }

  @Delete('remove/:id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id) {
    return this.commentService.remove(id);
  }
}
