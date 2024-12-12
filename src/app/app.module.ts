import { MiddlewareConsumer, Module, NestModule, Logger } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotmessageModule } from './modules/botmessage/botmessage.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from 'src/common/middleware/logger.middleware';

import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import session from 'express-session';

import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

@Module({
  imports: [
    // config .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const logger = new Logger('MongoDB');
        const uri = configService.get<string>('DATABASE_MONGO');

        mongoose.connection.on('connection', () => {
          logger.log('Connected to MongoDB successfully!');
          console.log(`Connected to MongoDB successfully!`);
        });

        mongoose.connection.on('error', (err) => {
          logger.error(`Failed to connect to MongoDB: ${err.message}`);
        });
        return { uri };
      },
      inject: [ConfigService],
    }),

    BotmessageModule,
    TelegramModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // config Logger
  configure(consumer: MiddlewareConsumer) {
    // Initialize client.
    let redisClient = createClient({
      url: process.env.REDIS_URL, // ระบุ URL ชัดเจน
    });
    redisClient.connect().catch(console.error);

    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer
      .apply(
        session({
          store: new RedisStore({ client: redisClient }),
          secret: process.env.SESSION_SECRET, // Change this to a secure key
          resave: false,
          saveUninitialized: false,
          cookie: {
            secure: false, // Set to true if using HTTPS
            maxAge:
              Number(process.env.SESSION_MAX_AGE_60_MINUTE) *
              Number(process.env.SESSION_HOURS),
          },
        }),
      )
      .forRoutes('*');
  }
}
