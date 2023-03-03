import { PartialType } from '@nestjs/mapped-types';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class BoardCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;
  @IsString()
  @IsOptional()
  readonly description: string;
  @IsString()
  @IsNotEmpty()
  readonly isPublic: string;
  @IsString()
  @IsOptional()
  readonly authBoardId: string;
}

export class BoardMember {
  @IsMongoId()
  @IsNotEmpty()
  readonly boardId: Types.ObjectId;
  @IsMongoId()
  @IsNotEmpty()
  readonly member: Types.ObjectId;
  @IsString()
  @IsOptional()
  readonly authBoardId: string;
}

export class BoardUpdateDto extends PartialType(BoardCreateDto) {}
