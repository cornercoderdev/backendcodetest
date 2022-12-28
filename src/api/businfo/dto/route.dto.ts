import { IsString } from 'class-validator';

export class RouteDto {
  @IsString()
  readonly busRouteId: string;

  @IsString()
  readonly busRouteNm: string;
}
