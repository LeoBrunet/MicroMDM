import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DeviceService } from '../../devices/services/device.service';
import { ApplicationService } from './application.service';
import { AppListResponseDto, AppListRequestDto } from '../dto/app-list.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApplicationMdmService {
  private readonly mdmApiUrl: string;
  private readonly apiToken: string;

  constructor(
    private deviceService: DeviceService,
    private applicationService: ApplicationService,
    private httpService: HttpService,
    private configService: ConfigService,
  )  {
    this.mdmApiUrl = this.configService.get<string>('MDM_API_URL');
    this.apiToken = this.configService.get<string>('MDM_API_TOKEN');
  }

  async handleInstalledAppList(responseData: AppListResponseDto, udid: string): Promise<any> {
    // Find the device
    const device = await this.deviceService.findByUdid(udid);
    
    if (!device) {
      throw new Error(`Device with UDID ${udid} not found`);
    }

    // Process each app in the list
    const results = [];
    for (const appInfo of responseData.InstalledApplicationList) {
      const appData = {
        identifier: appInfo.Identifier,
        name: appInfo.Name,
        version: appInfo.Version,
        shortVersion: appInfo.ShortVersion,
        deviceId: device.id,
        metadata: appInfo,
      };

      const app = await this.applicationService.createOrUpdate(appData);
      results.push(app);
    }

    return results;
  }

  async sendAppListCommand(appListDto: AppListRequestDto): Promise<any> {
    const { udid } = appListDto;
    
    // Prepare the request payload
    const payload = {
      udid,
      request_type: 'InstalledApplicationList'
    };

    try {
      // Send the request to the MDM API
      const response = await firstValueFrom(
        this.httpService.post(`${this.mdmApiUrl}/v1/commands`, payload, {
          auth: {
            username: 'micromdm',
            password: this.apiToken
          },
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to send app list command: ${error.message}`);
    }
  }
}