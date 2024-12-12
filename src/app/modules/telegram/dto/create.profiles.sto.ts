import { IsNumber, IsString, IsOptional } from 'class-validator';

export class ProfileDto {
  @IsString()
  readonly phone: string;


  @IsNumber()
  @IsOptional()
  readonly apiId: number;


  @IsString()
  @IsOptional()
  readonly apiHash: number;


  @IsString()
  readonly phoneCodeHash: string;

  @IsNumber()
  @IsOptional()
  readonly userId: number;

  @IsString()
  @IsOptional()
  readonly username: string;

  @IsString()
  @IsOptional()
  readonly session: string;
}
