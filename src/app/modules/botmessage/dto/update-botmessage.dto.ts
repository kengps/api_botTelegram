import { PartialType } from '@nestjs/mapped-types';
import { CreateBotmessageDto } from './create-botmessage.dto';

export class UpdateBotmessageDto extends PartialType(CreateBotmessageDto) {}
