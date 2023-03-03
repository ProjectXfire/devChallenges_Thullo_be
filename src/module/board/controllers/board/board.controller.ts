import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseGuards,
  Request,
  Query,
  Param,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
// Providers
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
// Models
import {
  BoardCreateDto,
  BoardUpdateDto,
  BoardMember,
} from '@module/board/models/board.dto';
import { Permission } from '@module/auth/models/permission';
import { PageQuery } from '@module/board/models/page.query';
import { Token } from '@module/auth/models/token';
// Services
import { BoardService } from '@module/board/services/board/board.service';
// Guards
import { PermissionGuard } from '@module/auth/guards/permission.guard';
// Decorators
import { Permissions } from '@module/auth/decorators/permission.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('board')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  getAll(@Query() query: PageQuery) {
    return this.boardService.getAll(query);
  }

  @Get('list/search')
  @HttpCode(HttpStatus.OK)
  searchBoards(@Query() query: PageQuery) {
    return this.boardService.searchBoards(query);
  }

  @Get('get/:id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string) {
    return this.boardService.getOne(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
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
  create(
    @Request() req,
    @Body() payload: BoardCreateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user: Token = req.user;
    return this.boardService.create(user.sub, payload, file);
  }

  @Get('find/member/:id')
  @HttpCode(HttpStatus.OK)
  getMember(@Request() req, @Param('id') id: string) {
    const user: Token = req.user;
    return this.boardService.getMember(id, user.sub);
  }

  @Put('update/:id')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.board.edit])
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id, @Body() payload: BoardUpdateDto) {
    return this.boardService.update(id, payload);
  }

  @Delete('delete/:id')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.board.remove])
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id) {
    return this.boardService.remove(id);
  }

  //******** Handle assign and remove users to the board ********/

  @Put('assign/member')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.board.member.assign])
  @HttpCode(HttpStatus.OK)
  assignMember(@Body() payload: BoardMember) {
    return this.boardService.assign(payload.member, payload.boardId);
  }

  @Put('remove/member')
  @UseGuards(PermissionGuard)
  @Permissions([Permission.admin, Permission.board.member.remove])
  @HttpCode(HttpStatus.OK)
  removeMember(@Body() payload: BoardMember) {
    return this.boardService.removeAssign(payload.member, payload.boardId);
  }
}
