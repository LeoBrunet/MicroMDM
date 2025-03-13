import { IsString } from 'class-validator';

export class ManageAppDto {
  @IsString()
  udid: string;

  @IsString()
  identifier: string;
}

export class ManageAppResponseDto {
  @IsString()
  CommandUUID: string;

  @IsString()
  Identifier: string;

  @IsString()
  State: string;

  @IsString()
  Status: string;

  @IsString()
  UDID: string;
}