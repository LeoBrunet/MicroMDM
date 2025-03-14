import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { DeviceService } from './device.service';
import { AuthenticateEventDto } from '../dto/authenticate.dto';
import { ManageDto, ManageAppResponseDto } from '../dto/manage.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class DeviceMdmService {

  private readonly mdmApiUrl: string;
  private readonly apiToken: string;

  constructor(
      private deviceService: DeviceService,
      private httpService: HttpService,
      private configService: ConfigService,
  )  {
      this.mdmApiUrl = this.configService.get<string>('MDM_API_URL');
      this.apiToken = this.configService.get<string>('MDM_API_TOKEN');
  }

  async handleAuthenticate(eventData : AuthenticateEventDto): Promise<any> {
    const { BuildVersion, IMEI, MEID, MessageType, OSVersion, ProductName, SerialNumber, Topic, UDID } = eventData;
  
    // Extract device information
    const deviceData = {
      udid: UDID,
      serialNumber: SerialNumber,
      productName: ProductName,
      osVersion: OSVersion,
      imei: IMEI,
      meid: MEID,
      buildVersion: BuildVersion,
      messageType: MessageType,
      topic: Topic,
      lastSeenAt: new Date(),
    };
  
    // Check if device exists
    let device = await this.deviceService.findByUdid(UDID);
  
    if (device) {
      // Update existing device
      device = await this.deviceService.update(device.id, deviceData);
    } else {
      // Create new device
      device = await this.deviceService.create({
        ...deviceData,
        isManaged: false,
        enrolledAt: new Date(),
      });
    }
  
    return device;
  }  

  async handleManageAppResult(responseData: ManageAppResponseDto): Promise<any> {
    const { UDID, Status } = responseData;
    
    // Find the device
    let device = await this.deviceService.findByUdid(UDID);
    
    if (!device) {
      throw new Error(`Device with UDID ${UDID} not found`);
    } else {
        // Update existing device based on status
        const isManaged = Status === 'Acknowledged'; // Assuming 'Acknowledged' means successful management // TODO: CHECK THAT
        console.log(`Device ${UDID} is managed: ${isManaged} since status is ${Status}`);
        return await this.deviceService.update(device.id, { isManaged });
    }
  }

  async sendManageAppCommand(manageDto: ManageDto): Promise<any> {
      const { udid, identifier } = manageDto;
      
      // Prepare the request payload
      const payload = {
        udid: udid,
        request_type: 'InstallApplication',
        identifier: identifier,
        change_management_state: 'Managed'
      };

      console.log(`api token : ${this.apiToken}`);
  
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
        throw new Error(`Failed to send manage app command: ${error.message}`);
      }
    }
}