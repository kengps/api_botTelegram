import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Model } from 'mongoose';
import {
  api3rdKey,
  Api3rdKeyDocument,
} from '../../telegram/schema/apikey.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    @InjectModel(api3rdKey.name)
    private readonly api3rdKeyModal: Model<Api3rdKeyDocument>,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['api3rd_key'];

    // ถ้าไม่มี API Key
    if (!apiKey) {
      throw new UnauthorizedException('API Key is required');
    }
    

    // ตรวจสอบว่าคีย์ถูกต้องหรือไม่
    const isValidApiKey = this.validateApiKey(apiKey as string);
    if (!isValidApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    return true; // อนุญาตให้ดำเนินการต่อ
  }

  //ตรวจสอบว่ามี key ใน db ไหม 
  private async validateApiKey(apiKey: string): Promise<boolean> {
    
    const isValidApiKey = await this.api3rdKeyModal.findOne({ api3rd_key: apiKey });   
   
    return !!isValidApiKey;
  }
}
