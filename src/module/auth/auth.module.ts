import { Module } from '@nestjs/common';
// Providers
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
// Models
import { Permission, PermissionSchema } from './models/permission.entity';
import {
  BoardPermission,
  BoardPermissionSchema,
} from '@module/board/models/board.permission.entity';
// Modules
import { UserModule } from '@module/user/user.module';
// Services
import { AuthService } from './services/auth/auth.service';
// Controllers
import { AuthController } from './controllers/auth/auth.controller';
// Strategies
import { JWTStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
// Config
import { ConfigType } from '@nestjs/config';
import config from '@app/app.config';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.jwt.secret,
          signOptions: {
            expiresIn: '3600s',
          },
        };
      },
      inject: [config.KEY],
    }),
    MongooseModule.forFeature([
      {
        name: Permission.name,
        schema: PermissionSchema,
      },
      {
        name: BoardPermission.name,
        schema: BoardPermissionSchema,
      },
    ]),
  ],
  providers: [JWTStrategy, LocalStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
