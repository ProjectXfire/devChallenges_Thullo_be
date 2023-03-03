import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class AttachmentCreateDto {
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
  @IsNotEmpty()
  @IsString()
  readonly fileType: string;
}

export class AttachmentDeleteDto {
  @IsNotEmpty()
  @IsString()
  imageURL: string;
}
