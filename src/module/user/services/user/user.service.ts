import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
// Providers
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
// Models
import { User } from '@module/user/models/user.entity';
import { UserCreateDto, UserUpdateDto } from '@module/user/models/user.dto';
// Services
import { CloudinaryService } from '@module/cloudinary/services/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(payload: UserCreateDto) {
    try {
      const newUser = new this.userModel(payload);
      const hashPass = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashPass;
      newUser.createdAt = new Date();
      newUser.updatedAt = new Date();
      newUser.completeName =
        newUser.name.toLowerCase() + ' ' + newUser.lastname.toLowerCase();
      await newUser.save();
      return {
        message: 'User created',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async get(id: Types.ObjectId) {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      return {
        _id: user._id,
        username: user.username,
        name: user.name,
        lastname: user.lastname,
        avatar: user.avatar,
        avatarId: user.avatarId,
        email: user.email,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async exist(id: Types.ObjectId) {
    try {
      return await this.userModel.exists({ _id: id });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: Types.ObjectId,
    payload: UserUpdateDto,
    file: Express.Multer.File,
  ) {
    let user = null;
    let updateDate = {
      ...payload,
      completeName:
        payload.name.toLowerCase() + ' ' + payload.lastname.toLowerCase(),
      updatedAt: new Date(),
    };
    try {
      if (!payload.avatar && !payload.avatarId) {
        if (!file) {
          user = await this.userModel.findByIdAndUpdate(
            { _id: id },
            { $set: updateDate },
            { new: true },
          );
        } else {
          const { url, publicId } = await this.cloudinaryService.upload(file);
          updateDate = {
            ...updateDate,
            avatar: url,
            avatarId: publicId,
          };
          user = await this.userModel.findByIdAndUpdate(
            { _id: id },
            { $set: updateDate },
            { new: true },
          );
        }
      } else {
        if (!file) {
          user = await this.userModel.findByIdAndUpdate(
            { _id: id },
            { $set: updateDate },
            { new: true },
          );
        } else {
          const { url, publicId } = await this.cloudinaryService.upload(file);
          await this.cloudinaryService.destroyImage(payload.avatarId);
          updateDate = {
            ...updateDate,
            avatar: url,
            avatarId: publicId,
          };
          user = await this.userModel.findByIdAndUpdate(
            { _id: id },
            { $set: updateDate },
            { new: true },
          );
        }
      }
      if (!user) {
        throw new NotFoundException(
          `User does not exist, could not be updated`,
        );
      }
      return {
        message: 'User updated',
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async searchUser(search: string) {
    try {
      const users = await this.userModel.find({
        completeName: {
          $regex: search,
        },
      });
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
