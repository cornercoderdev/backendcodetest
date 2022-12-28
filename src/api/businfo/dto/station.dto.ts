import { IsArray, IsOptional, IsString } from 'class-validator';
import { ArrivingBusDto } from './arrivingbus.dto';

export class StationDto {
  @IsString()
  readonly arsId: string;

  @IsString()
  readonly stNm: string;

  @IsString()
  readonly plainNo1: string;

  @IsString()
  readonly vehId1: string;

  @IsString()
  readonly rtNm: string;

  @IsString()
  readonly traTime1: string;

  @IsArray()
  @IsOptional()
  arrival: ArrivingBusDto[];
}
