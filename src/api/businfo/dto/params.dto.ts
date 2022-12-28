import { UsePipes, ValidationPipe } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';

@UsePipes(new ValidationPipe({ whitelist: true }))
export class ParamsDto {
  @IsString()
  @IsOptional()
  resultType: string;

  @IsString()
  @IsOptional()
  readonly arsId: string;

  @IsString()
  @IsOptional()
  readonly busRouteId: string;

  @IsString()
  @IsOptional()
  readonly vehId: string;
}
