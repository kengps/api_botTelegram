import { PartialType } from '@nestjs/mapped-types';
import { Api3rdKeyDto } from './create-api3rdkey.dto';

export class UpdateTelegramDto extends PartialType(Api3rdKeyDto) {}
