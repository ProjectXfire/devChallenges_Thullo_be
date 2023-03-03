import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
//import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Request } from 'express';
// Models
import { Token } from '../models/token';
import {
  BoardPermission,
  IBoardPermission,
} from '@module/board/models/board.permission.entity';
// Decorators
import { PERMISSION_KEY } from '@module/auth/decorators/permission.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(BoardPermission.name)
    private boardPermissionModel: Model<BoardPermission>,
  ) {}
  async canActivate(
    context: ExecutionContext,
  ) /*: boolean | Promise<boolean> | Observable<boolean> */ {
    const permissions = this.reflector.get<string[]>(
      PERMISSION_KEY,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest<Request>();
    const boardIdBody = request.body.authBoardId;
    const boardIdHeader = request.headers.authboardid;
    const { sub } = request.user as Token;
    const value = await this.validateAccess(
      boardIdBody || boardIdHeader,
      sub,
      permissions,
    );
    if (value) {
      return true;
    }
    throw new UnauthorizedException('You do not have permission');
  }

  async validateAccess(
    boardId: string,
    userId: Types.ObjectId,
    routePermissions: string[],
  ): Promise<boolean> {
    try {
      const userBoadPermissions: IBoardPermission =
        await this.boardPermissionModel
          .findOne({
            boardId,
            userId,
          })
          .populate('permissions');
      const hasPermission = routePermissions.some((routePerm) => {
        const exist = userBoadPermissions.permissions.find(
          (perm) => perm.key === routePerm,
        );
        if (exist) {
          return true;
        }
      });
      return hasPermission;
    } catch (error) {
      return false;
    }
  }
}
