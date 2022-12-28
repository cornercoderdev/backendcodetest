import { BadRequestException, Controller, Get } from '@nestjs/common';
import { BusinfoService } from './businfo.service';

@Controller('businfo')
export class BusinfoController {
  constructor(private readonly businfoService: BusinfoService) {}

  @Get()
  getAll() {
    try {
      return this.businfoService.listBusInfo();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
