import { ProfileDto } from './dto/create.profiles.sto';
import { api3rdKey, Api3rdKeyDocument } from './schema/apikey.schema';

import { telegramTypeApi, AuthResult } from './types';

import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Api3rdKeyDto } from './dto/create-api3rdkey.dto';
import { UpdateTelegramDto } from './dto/update-telegram.dto';
import { TelegramClient, Api } from 'telegram';
import { StringSession } from 'telegram/sessions';
import { NewMessage } from 'telegram/events';

import { withTryCatch } from 'src/shared/withTryCatch';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateKey } from 'src/shared/generatekey';

import { cl } from 'src/shared/toggleLogs';
import { profile, ProfilesDocument } from './schema/profiles.schema';
import session from 'express-session';

@Injectable()
export class TelegramService {
  // private readonly config: telegramTypeApi = {
  //   apiId: Number(process.env.TELEGRAM_API_ID) || 26880459,
  //   apiHash:
  //     process.env.TELEGRAM_API_HASH || 'e46b6fe489f8aaa8dc1ac672f2d1dd39',
  // };

  private client: TelegramClient;

  constructor(
    @InjectModel(api3rdKey.name)
    private readonly api3rdKeyModel: Model<Api3rdKeyDocument>,

    @InjectModel(profile.name)
    private readonly profilesModel: Model<ProfilesDocument>,
  ) {
    // this.client = new TelegramClient(
    //   new StringSession(''),
    //   this.config.apiId,
    //   this.config.apiHash,
    //   {
    //     connectionRetries: 5,
    //   },
    // );
  }

  async initializeClient(headers): Promise<void> {
    // ดึง apiId และ apiHash จากฐานข้อมูลโดยใช้ api3rdKeyId
    const api3rd_key = headers.api3rd_key;
    const apiData = await this.api3rdKeyModel.findOne({ api3rd_key });

    if (!apiData || !apiData.apiId || !apiData.apiHash) {
      throw new Error('API configuration not found');
    }

    // สร้าง TelegramClient ด้วย apiId และ apiHash ที่ดึงมา
    this.client = new TelegramClient(
      new StringSession(''), // คุณสามารถโหลด session จากที่อื่นได้
      apiData.apiId,
      apiData.apiHash,
      {
        connectionRetries: 5,
      },
    );
  }

  async create(data: { phone: string }) {
    const { phone } = data;

    return `This action adds a new  ${phone} to the`;
  }

  async sendOtp(profileDto: ProfileDto, req: any): Promise<any> {
    const { phone } = profileDto;
    console.log(`⩇⩇:⩇⩇🚨  file: telegram.service.ts:80  phone :`, phone);

    try {
      let profile = await this.profilesModel.findOne({ phone });

      if (!profile) {
        profile = new this.profilesModel({ phone });
        await profile.save(); // สร้างเอกสารใหม่หากไม่มี
      }

      const sendCode = withTryCatch(async () => {
        await this.client.connect();
        return await this.client.invoke(
          new Api.auth.SendCode({
            phoneNumber: phone,
            apiId: this.client.apiId,
            apiHash: this.client.apiHash,
            settings: new Api.CodeSettings({
              allowFlashcall: false,
              currentNumber: true,
              allowAppHash: false,
            }),
          }),
        );
      });

      const result = (await sendCode()) as any;

      req.session.phone = phone; // บันทึกเบอร์โทรศัพท์
      req.session.phoneCodeHash = result.phoneCodeHash; // บันทึก phoneCodeHash
      // req.session.telegramSession = sessionData; // บันทึก Telegram session

      // บันทึกลงในฐานข้อมูล
      await this.profilesModel.updateOne(
        { phone },
        {
          phoneCodeHash: result.phoneCodeHash,
        },
      );

      return {
        message: 'OTP sent successfully',
        data: result,
      };
    } catch (error) {
      console.error(`⩇⩇:⩇⩇🚨 error:`, error);
      throw new Error('Failed to send OTP');
    }
  }

  async verifyOtp(
    data: {
      otp: string;
    },
    req: any,
  ): Promise<any> {
    try {
      const { phone, phoneCodeHash } = req.session;

      await this.client.connect();

      const result: any = await this.client.invoke(
        new Api.auth.SignIn({
          phoneNumber: phone,
          phoneCode: data.otp,
          phoneCodeHash: phoneCodeHash,
        }),
      );

      const session = this.client.session.save();

      req.session.sessions = session;
      await this.profilesModel.updateOne({ phone }, { session: session });

      return {
        message: 'Login successfully',
        userInfo: result.user,
      };
    } catch (error) {}
  }

  async sendMessage(data: { to: string[]; msg: string }, req: any) {
    try {
      const { to, msg } = data;
      console.log(`⩇⩇:⩇⩇🚨  file: telegram.service.ts:141  msg :`, msg);

      const { phone, phoneCodeHash, sessions } = req.session;
      console.log(
        `⩇⩇:⩇⩇🚨  file: telegram.service.ts:165  sessions :`,
        sessions,
      );

      const me = this.client.getMe()
      console.log(`⩇⩇:⩇⩇🚨  file: telegram.service.ts:174  me :`, me);

      const dbSession = await this.profilesModel.findOne({ session: sessions });
      console.log(`⩇⩇:⩇⩇🚨  file: telegram.service.ts:175  dbSession :`, dbSession);

    

      if (!sessions || sessions !== dbSession.session) {
        throw new NotFoundException("You don't have any sessions");
      }

      const stringSession = new StringSession(dbSession.session);
      this.client.session = stringSession;

      await this.client.connect();

      const results = await Promise.all(
        to.map(async (recipient) => {
          try {
            const entity = await this.client.getEntity(recipient); // Resolve recipient
            const result = await this.client.sendMessage(entity, {
              message: msg,
            });
            console.log(
              `⩇⩇:⩇⩇🚨  file: telegram.service.ts:164  result :`,
              result,
            );

            return { recipient, success: true, msg: result.message };
          } catch (error) {
            console.error(`Error sending message to ${recipient}:`, error);
            return { recipient, success: false, error: error.message };
          }
        }),
      );

      return {
        status: '0',
        msg: 'Messages processed',
        res: {
          success: results.filter((res) => res.success),
          fail: results.filter((res) => !res.success),
        },
      };
    } catch (error) {
      console.log(`⩇⩇:⩇⩇🚨  file: telegram.service.ts:165  error :`, error);
    }
  }

  async createApi3rd(api3rdKeyDto: Api3rdKeyDto): Promise<api3rdKey> {
    // const data = new this.api3rdKeyModel(api3rdKeyDto);

    const username = api3rdKeyDto.username;
    const usernameIsExist = await this.api3rdKeyModel.findOne({ username });

    if (usernameIsExist) {
      throw new ConflictException('Already have this username');
    }

    const fullKey = await generateKey();

    cl('This will be logged', 'INFO');

    const data = new this.api3rdKeyModel({
      username: username,
      api3rd_key: fullKey,
    });

    return data.save();
  }

  async createApiId(
    data: {
      phone: string;
      api_id: number;
      api_hash: string;
    },
    headers,
  ): Promise<any> {
    const { phone, api_id, api_hash } = data;
    try {
      const api3rd_key = headers.api3rd_key;

      const profile = await this.api3rdKeyModel.findOne({
        api3rd_key: api3rd_key,
      });

      if (!profile) {
        console.log('No profile found for apikey:', api3rd_key);
      } else {
        console.log('Found profile:', profile);
      }

      await this.api3rdKeyModel.updateOne(
        { api3rd_key }, // ใช้เงื่อนไขที่ตรงกับฟิลด์ในฐานข้อมูล
        { apiId: api_id, apiHash: api_hash },
      );

      return {
        message: 'successfully saved',
        result: profile,
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  findAll() {
    return `This action returns all telegram`;
  }
  async LogOut() {}

  findOne(id: string) {
    return `This action returns a #${id} telegram`;
  }

  update(id: string, updateTelegramDto: UpdateTelegramDto) {
    return `This action updates a #${id} telegram`;
  }

  remove(id: string) {
    return `This action removes a #${id} telegram`;
  }
}
