import { PartialType } from '@nestjs/mapped-types';
import {
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Types } from 'mongoose';

export class LabelCreateDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  readonly title: string;
  @IsNotEmpty()
  @IsString()
  @MaxLength(7)
  readonly color: string;
  // Reference
  @IsNotEmpty()
  @IsMongoId()
  readonly boardId: Types.ObjectId;
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

export class LabelUpdateDto extends PartialType(LabelCreateDto) {}
