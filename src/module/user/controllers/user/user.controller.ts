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
  UseInterceptors,
  UploadedFile,
  Query,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
// Providers
import { AuthGuard } from '@nestjs/passport';
// Models
import { Token } from '@module/auth/models/token';
import { UserCreateDto, UserUpdateDto } from '@module/user/models/user.dto';
// Services
import { UserService } from '@module/user/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('get')
  @HttpCode(HttpStatus.OK)
  getByToken(@Request() req) {
    const user: Token = req.user;
    return this.userService.get(user.sub);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get/:id')
  @HttpCode(HttpStatus.OK)
  get(@Param('id') id) {
    return this.userService.get(id);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() payload: UserCreateDto) {
    return this.userService.create(payload);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  @HttpCode(HttpStatus.OK)
  search(@Request() req, @Query('search') search: string) {
    return this.userService.searchUser(search);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update')
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
  update(
    @Request() req,
    @Body() payload: UserUpdateDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const user: Token = req.user;
    return this.userService.update(user.sub, payload, file);
  }
}
