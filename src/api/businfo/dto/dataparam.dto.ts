import { IsOptional, IsString } from 'class-validator';

export class DataParamDto {
  @IsString()
  readonly api: string;

  @IsString()
  readonly route: string;

  @IsString()
  @IsOptional()
  params: object;
}
