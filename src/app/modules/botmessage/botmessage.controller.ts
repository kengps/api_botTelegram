import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BotmessageService } from './botmessage.service';
import { CreateBotmessageDto } from './dto/create-botmessage.dto';
import { UpdateBotmessageDto } from './dto/update-botmessage.dto';

@Controller('botmessage')
export class BotmessageController {
  constructor(private readonly botmessageService: BotmessageService) {}

  @Post()
  create(@Body() createBotmessageDto: CreateBotmessageDto) {
    return this.botmessageService.create(createBotmessageDto);
  }

  @Get()
  findAll() {
    return this.botmessageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.botmessageService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBotmessageDto: UpdateBotmessageDto,
  ) {
    return this.botmessageService.update(+id, updateBotmessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.botmessageService.remove(+id);
  }

  //todo Telegram botMessage Test Methods

    // Telegram botMessage Test Methods
    @Post('sendVideo')
    sendVideo(@Body() data: { text: string; chatId: number; token: string }) {
      return this.botmessageService.sendVideo(data);
    }
  
    @Post('sendMessage')
    sendMessage(@Body() data: { text: string; chatId: number; token: string }) {
      return this.botmessageService.sendMessage(data);
    }
  }
