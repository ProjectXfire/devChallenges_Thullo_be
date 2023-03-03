import { Injectable, InternalServerErrorException } from '@nestjs/common';
// Providers
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
// Models
import { Permission } from '@module/auth/models/permission.entity';
// Services
import { UserService } from '@module/user/services/user/user.service';
import { Model } from 'mongoose';
import { PermissionCreateDto } from '@module/auth/models/permission.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectModel(Permission.name) private modelPermission: Model<Permission>,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.userService.getByEmail(email);
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          return user;
        }
        return null;
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  generateJWT(user: any) {
    const payload = {
      sub: user._id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createPermission(payload: PermissionCreateDto) {
    try {
      const permission = new this.modelPermission(payload);
      permission.createdAt = new Date();
      permission.updatedAt = new Date();
      await permission.save();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll() {
    try {
      const permissions = await this.modelPermission.find();
      return {
        result: permissions,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
