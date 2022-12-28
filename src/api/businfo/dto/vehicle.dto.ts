import { IsString } from 'class-validator';

export class VehicleDto {
  @IsString()
  readonly vehId: string;

  @IsString()
  readonly plainNo: string;
}
