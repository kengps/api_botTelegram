import { IsNumber, IsString, IsOptional } from 'class-validator';

export class Api3rdKeyDto {
  @IsString()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly api3rdKey: string;

  @IsNumber()
  @IsOptional()
  readonly apiId: number;


  @IsString()
  @IsOptional()
  readonly apiHash: number;


}
