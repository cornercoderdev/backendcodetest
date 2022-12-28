import { Test, TestingModule } from '@nestjs/testing';
import { BusinfoController } from './businfo.controller';
import { BusinfoService } from './businfo.service';
import { HttpModule } from '@nestjs/axios';

describe('BusinfoController', () => {
  let controller: BusinfoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BusinfoService],
      controllers: [BusinfoController],
    }).compile();

    controller = module.get<BusinfoController>(BusinfoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
