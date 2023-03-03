import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class BoardPermissionDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly boardId: Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  readonly userId: Types.ObjectId;
  @IsNotEmpty()
  @IsArray()
  readonly permissions: Types.ObjectId[];
  @IsString()
  @IsOptional()
  readonly authBoardId: string;
}
