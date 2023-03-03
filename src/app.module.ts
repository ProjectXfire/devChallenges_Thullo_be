import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
// Modules
import { DatabaseModule } from './module/database/database.module';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { BoardModule } from './module/board/board.module';
import { CloudinaryModule } from './module/cloudinary/cloudinary.module';
import { ChatGateway } from './gateways/board.gateway';
// Config
import config from '@app/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [config],
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    BoardModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
})
export class AppModule {}
