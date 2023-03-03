import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// Models
import { LabelUpdateDto } from '@module/board/models/label.dto';
// Services
import { LabelService } from '@module/board/services/label/label.service';

@UseGuards(AuthGuard('jwt'))
@Controller('label')
export class LabelController {
  constructor(private labelService: LabelService) {}

  @Get('list/:id')
  @HttpCode(HttpStatus.OK)
  getAllByTask(@Param('id') id) {
    return this.labelService.getAllByTask(id);
  }

  @Put('update/:id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id, @Body() payload: LabelUpdateDto) {
    return this.labelService.update(id, payload);
  }

  @Put('update/all/:id')
  @HttpCode(HttpStatus.OK)
  updateByTaskId(@Param('id') id, @Body() payload: LabelUpdateDto) {
    return this.labelService.updateByTaskId(id, payload);
  }
}
