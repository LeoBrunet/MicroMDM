import { IsString } from 'class-validator';

export class AuthenticateEventDto {
  @IsString()
  BuildVersion: string;

  @IsString()
  IMEI: string;

  @IsString()
  MEID: string;

  @IsString()
  MessageType: string;

  @IsString()
  OSVersion: string;

  @IsString()
  ProductName: string;

  @IsString()
  SerialNumber: string;

  @IsString()
  Topic: string;

  @IsString()
  UDID: string;
}


export class CheckOutEventDto {
  @IsString()
  UDID: string;
}