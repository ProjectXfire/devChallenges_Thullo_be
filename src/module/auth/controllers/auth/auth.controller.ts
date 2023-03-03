import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
// Providers
import { AuthGuard } from '@nestjs/passport';
// Models
import { PermissionCreateDto } from '@module/auth/models/permission.dto';
// Services
import { AuthService } from '@module/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Req() req: Request) {
    return this.authService.generateJWT(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('permission/list')
  getPermissions() {
    return this.authService.getAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('permission/create')
  createPermission(@Body() payload: PermissionCreateDto) {
    return this.authService.createPermission(payload);
  }
}
