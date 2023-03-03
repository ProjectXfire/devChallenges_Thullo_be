import { Module } from '@nestjs/common';
// Providers
import { MongooseModule } from '@nestjs/mongoose';
// Models
import { User, UserSchema } from './models/user.entity';
// Modules
import { CloudinaryModule } from '@module/cloudinary/cloudinary.module';
// Services
import { UserService } from './services/user/user.service';
// Controllers
import { UserController } from './controllers/user/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    CloudinaryModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
