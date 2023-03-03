import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// Models
import {
  ListCreateDto,
  ListUpdateDto,
  RemoveTaskDto,
} from '@module/board/models/list.dto';
import { Permission } from '@module/auth/models/permission';
import { TaskCreateDto } from '@module/board/models/task.dto';
// Services
import { ListService } from '@module/board/services/list/list.service';
// Guards
import { PermissionGuard } from '@module/auth/guards/permission.guard';
// Decorators
import { Permissions } from '@module/auth/decorators/permission.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('tasklist')
export class ListController {
  constructor(private taskListService: ListService) {}

  @Get('list/:id')
  @HttpCode(HttpStatus.OK)
  getAll(@Param('id') id) {
    return this.taskListService.getAllByBoard(id);
  }

  @Post('create')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.list.create])
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: ListCreateDto) {
    return this.taskListService.create(payload);
  }

  @Put('update/:id')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.list.edit])
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id, @Body() payload: ListUpdateDto) {
    return this.taskListService.update(id, payload);
  }

  @Delete('remove/:id')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.list.remove])
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id) {
    return this.taskListService.remove(id);
  }

  //******** Handle assign and remove tasks to the list ********/

  @Put('asssign/task')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.create])
  @HttpCode(HttpStatus.OK)
  assignTask(@Body() payload: TaskCreateDto) {
    return this.taskListService.assign(payload);
  }

  @Put('remove/task')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.task.remove])
  @HttpCode(HttpStatus.OK)
  removeTask(@Body() payload: RemoveTaskDto) {
    return this.taskListService.removeAssign(payload.listId, payload.taskId);
  }
}
