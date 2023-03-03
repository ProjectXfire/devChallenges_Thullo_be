import { PartialType } from '@nestjs/mapped-types';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class TaskCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @IsOptional()
  @IsString()
  readonly description: string;
  @IsOptional()
  @IsString()
  readonly cover: string;
  @IsOptional()
  @IsString()
  readonly coverId: string;
  @IsOptional()
  @IsNumber()
  readonly countAttachments: number;
  @IsOptional()
  @IsNumber()
  readonly countComments: number;
  // For delete porpuse
  @IsNotEmpty()
  @IsMongoId()
  readonly listId: Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  readonly boardId: Types.ObjectId;
  @IsString()
  @IsOptional()
  readonly authBoardId: string;
}

export class TaskMember {
  @IsNotEmpty()
  @IsMongoId()
  readonly taskId: Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  readonly userId: Types.ObjectId;
  @IsString()
  @IsOptional()
  readonly authBoardId: string;
}

export class RemoveLabel {
  @IsNotEmpty()
  @IsMongoId()
  readonly taskId: Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  readonly labelId: Types.ObjectId;
  @IsString()
  @IsOptional()
  readonly authBoardId: string;
}

export class TaskUpdateDto extends PartialType(TaskCreateDto) {}
