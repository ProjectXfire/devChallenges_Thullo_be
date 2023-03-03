import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CommentCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly comment: string;
  // Rerefence
  @IsNotEmpty()
  @IsMongoId()
  readonly boardId: Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  readonly listId: Types.ObjectId;
  @IsNotEmpty()
  @IsMongoId()
  readonly taskId: Types.ObjectId;
}

export class CommentUpdateDto extends PartialType(CommentCreateDto) {}
