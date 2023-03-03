import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// Services
import { BoardPermissionService } from '@module/board/services/board-permission/board-permission.service';
// Models
import { BoardPermissionDto } from '@module/board/models/board.permission.dto';
import { Permission } from '@module/auth/models/permission';
// Guards
import { PermissionGuard } from '@module/auth/guards/permission.guard';
// Decorators
import { Permissions } from '@module/auth/decorators/permission.decorator';
import { Types } from 'mongoose';

@UseGuards(AuthGuard('jwt'))
@Controller('permission')
export class BoardPermissionController {
  constructor(private boardPermissionService: BoardPermissionService) {}

  @Get('get/user/:id')
  @HttpCode(HttpStatus.OK)
  get(
    @Param('id') id: Types.ObjectId,
    @Query('boardid') boardId: Types.ObjectId,
  ) {
    return this.boardPermissionService.getUserPermissions(id, boardId);
  }

  @Put('update/user')
  @HttpCode(HttpStatus.OK)
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin])
  update(@Body() payload: BoardPermissionDto) {
    return this.boardPermissionService.update(payload);
  }
}
