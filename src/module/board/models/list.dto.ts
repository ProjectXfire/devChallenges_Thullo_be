import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class ListCreateDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly boardId: Types.ObjectId;
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @IsOptional()
  @IsArray()
  readonly tasks: Types.ObjectId[];
  @IsString()
  @IsOptional()
  readonly authBoardId: string;
}

export class RemoveTaskDto {
  @IsNotEmpty()
  @IsMongoId()
  readonly listId: Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  readonly taskId: Types.ObjectId;
  @IsString()
  @IsOptional()
  readonly authBoardId: string;
}

export class ListUpdateDto extends PartialType(ListCreateDto) {}
