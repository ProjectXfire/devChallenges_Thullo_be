import { IsNotEmpty, IsString } from 'class-validator';

export class PermissionCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;
  @IsNotEmpty()
  @IsString()
  readonly key: string;
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}
