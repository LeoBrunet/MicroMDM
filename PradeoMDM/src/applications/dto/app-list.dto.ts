import { IsString, IsArray, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class AppInfoDto {
  @IsBoolean()
  AdHocCodeSigned: boolean;

  @IsBoolean()
  AppStoreVendable: boolean;

  @IsBoolean()
  BetaApp: boolean;

  @IsNumber()
  BundleSize: number;

  @IsBoolean()
  DeviceBasedVPP: boolean;

  @IsString()
  DistributorIdentifier: string;

  @IsNumber()
  DynamicSize: number;

  @IsNumber()
  ExternalVersionIdentifier: number;

  @IsBoolean()
  HasUpdateAvailable: boolean;

  @IsString()
  Identifier: string;

  @IsBoolean()
  Installing: boolean;

  @IsBoolean()
  IsAppClip: boolean;

  @IsBoolean()
  IsValidated: boolean;

  @IsString()
  Name: string;

  @IsString()
  ShortVersion: string;

  @IsString()
  Version: string;
}

export class AppListRequestDto {
  @IsString()
  udid: string;
}

export class AppListResponseDto {
  @IsString()
  CommandUUID: string;

  @IsArray()
  InstalledApplicationList: AppInfoDto[];
}