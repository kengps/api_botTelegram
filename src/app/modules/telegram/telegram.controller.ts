import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { Api3rdKeyDto } from './dto/create-api3rdkey.dto';
import { UpdateTelegramDto } from './dto/update-telegram.dto';
import { ApiKeyGuard } from '../auth/guard/keyapi-auth.guard';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Post()
  create(@Body() data) {
    return this.telegramService.create(data);
  }

  @Post('send-otp')
  async sendOtp(@Body() data, @Req() req, @Headers() headers: any) {
    await this.telegramService.initializeClient(headers);
    return this.telegramService.sendOtp(data, req);
  }

  @UseGuards(ApiKeyGuard)
  @Post('createapi3rd')
  createApi3rd(@Body() data) {
    return this.telegramService.createApi3rd(data);
  }

  @UseGuards(ApiKeyGuard)
  @Post('createapi-id')
  createApiId(@Body() data, @Headers() headers: any) {
    return this.telegramService.createApiId(data, headers);
  }

  @UseGuards(ApiKeyGuard)
  @Post('simplesend')
  sendMessage(@Body() data, @Req() res) {
    return this.telegramService.sendMessage(data, res);
  }

  @Post('verify-otp')
  verifyOtp(@Body() data, @Req() req) {
    return this.telegramService.verifyOtp(data, req);
  }

  @Get()
  findAll() {
    return this.telegramService.findAll();
  }
  @Post('logout')
  LogOut() {
    return this.telegramService.LogOut();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.telegramService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTelegramDto: UpdateTelegramDto,
  ) {
    return this.telegramService.update(id, updateTelegramDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.telegramService.remove(id);
  }
}
