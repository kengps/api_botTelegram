import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';
import { api3rdKey, Api3rdKeySchema } from './schema/apikey.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { profile, ProfilesSchema } from './schema/profiles.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: api3rdKey.name, schema: Api3rdKeySchema },
      { name: profile.name, schema: ProfilesSchema },
    ]),
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
