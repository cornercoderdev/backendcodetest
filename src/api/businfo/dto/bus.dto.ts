import { IsString } from 'class-validator';

export class BusDto {
  @IsString()
  readonly busNumber: string;

  @IsString()
  readonly plateNumber: string;

  @IsString()
  readonly eta: string;
}
