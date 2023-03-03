import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class PageQuery {
  @IsNumber()
  @Min(1)
  readonly page: number;
  @IsNumber()
  readonly limit: number;
  @IsString()
  @IsOptional()
  readonly search: string;
}
