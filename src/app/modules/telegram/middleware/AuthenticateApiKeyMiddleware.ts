import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TelegramService } from '../telegram.service'; // Replace with the actual service path

@Injectable()
export class AuthenticateApiKeyMiddleware implements NestMiddleware {
  constructor(private readonly telegramService: TelegramService) {}

  async use(req: Request, res: Response, next: NextFunction) {

    const authHeader = req.headers['authorization'];
    const apiKey = authHeader?.split(' ')[1];

    if (!apiKey) {
      return res.status(401).json({ error: 'API Key is required' });
    }

    // const user = await this.telegramService.findByApiKey(apiKey);

    // if (!user) {
    //   return res.status(403).json({ error: 'Invalid API Key' });
    // }

    // req['user'] = user; // Store the user data in the request object
    next();
  }
}
