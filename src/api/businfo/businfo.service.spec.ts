import { Test, TestingModule } from '@nestjs/testing';
import { BusinfoService } from './businfo.service';
import { RouteDto } from './dto';
import { HttpModule } from '@nestjs/axios';

describe('BusinfoService', () => {
  let service: BusinfoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [BusinfoService],
    }).compile();

    service = module.get<BusinfoService>(BusinfoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('', () => {
    expect(service).toBeDefined();
  });
});
