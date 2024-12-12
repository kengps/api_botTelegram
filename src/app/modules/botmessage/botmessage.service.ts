import { Injectable } from '@nestjs/common';
import { CreateBotmessageDto } from './dto/create-botmessage.dto';
import { UpdateBotmessageDto } from './dto/update-botmessage.dto';




const TELEGRAM_HEADERS = {
  accept: 'application/json',
  'User-Agent': 'Telegram Bot SDK - (https://github.com/irazasyed/telegram-bot-sdk)',
  'content-type': 'application/json',
};

@Injectable()
export class BotmessageService {
  create(createBotmessageDto: CreateBotmessageDto) {
    return 'This action adds a new botmessage';
  }

  findAll() {
    return `This action returns all botmessage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} botmessage`;
  }

  update(id: number, updateBotmessageDto: UpdateBotmessageDto) {
    return `This action updates a #${id} botmessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} botmessage`;
  }

  // //todo Telegram botMessage Test Methods

  private async makeTelegramApiCall(
    token: string,
    endpoint: string,
    payload: Record<string, any>,
  ): Promise<any> {
    const url = `https://api.telegram.org/bot${token}/${endpoint}`;
    console.log(endpoint);
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: TELEGRAM_HEADERS,
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error(`Error making Telegram API call to ${endpoint}:`, error);
      throw new Error(`Failed to make Telegram API call to ${endpoint}.`);
    }
  }

  async sendVideo(data: { text: string; chatId: number; token: string }) {
    
    const payload = {
      video: 'https://videos.pexels.com/video-files/7670218/7670218-uhd_2732_1440_25fps.mp4',
      caption: data.text,
      chat_id: data.chatId,
    };
    console.log('d');
    return this.makeTelegramApiCall(data.token, 'sendVideo', payload);
  }

  async sendMessage(data: { text: string; chatId: number; token: string }) {
    const payload = {
      text: data.text,
      chat_id: data.chatId,
    };
    return this.makeTelegramApiCall(data.token, 'sendMessage', payload);
  }
}
