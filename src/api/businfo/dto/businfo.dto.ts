import { BusDto } from './bus.dto';
import { RouteDto } from './route.dto';
import { StationDto } from './station.dto';

export class BusinfoDto {
  readonly routes: RouteDto[];

  readonly stations: StationDto[];

  readonly buses: BusDto[] | string;
}
