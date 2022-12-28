import { BadRequestException, Controller, Get } from '@nestjs/common';
import { BusinfoService } from './businfo.service';

@Controller('businfo')
export class BusinfoController {
  constructor(private readonly businfoService: BusinfoService) {}

  @Get()
  getAll() {
    try {
      // return this.businfoService.getAllStation();
      // return this.businfoService.selectBusyStations();
      // return this.businfoService.extractRandomRoutes();
      return this.businfoService.listBusInfo();
      // return this.businfoService.getAllRoutes();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
