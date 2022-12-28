import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BusinfoService } from './businfo.service';
import { BusinfoController } from './businfo.controller';

@Module({
  imports: [HttpModule],
  providers: [BusinfoService],
  controllers: [BusinfoController],
})
export class BusinfoModule {}
