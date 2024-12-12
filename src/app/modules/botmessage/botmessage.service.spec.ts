import { Test, TestingModule } from '@nestjs/testing';
import { BotmessageService } from './botmessage.service';

describe('BotmessageService', () => {
  let service: BotmessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BotmessageService],
    }).compile();

    service = module.get<BotmessageService>(BotmessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
