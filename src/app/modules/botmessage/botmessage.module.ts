import { Module } from '@nestjs/common';
import { BotmessageService } from './botmessage.service';
import { BotmessageController } from './botmessage.controller';

@Module({
  controllers: [BotmessageController],
  providers: [BotmessageService],
})
export class BotmessageModule {}
