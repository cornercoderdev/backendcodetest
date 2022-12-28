import { IsOptional, IsString } from 'class-validator';

export class ArrivingBusDto {
  @IsString()
  readonly busRouteId: string;

  @IsString()
  @IsOptional()
  readonly plainNo1: string;

  @IsString()
  readonly vehId1: string;

  @IsString()
  readonly rtNm: string;

  @IsString()
  readonly traTime1: string;
}
