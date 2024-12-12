import { Test, TestingModule } from '@nestjs/testing';
import { BotmessageController } from './botmessage.controller';
import { BotmessageService } from './botmessage.service';

describe('BotmessageController', () => {
  let controller: BotmessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotmessageController],
      providers: [BotmessageService],
    }).compile();

    controller = module.get<BotmessageController>(BotmessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
