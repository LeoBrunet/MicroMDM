import { Injectable } from '@nestjs/common';
import { DeviceService } from '../devices/device.service';
import { ApplicationService } from '../applications/application.service';
import { XmlParserService } from './xml-parser.service';
import { AuthenticateEventDto } from './dto/authenticate.dto';
import { ManageAppResponseDto } from './dto/manage-app.dto';
import { AppListResponseDto, AppInfoDto } from './dto/app-list.dto';

@Injectable()
export class MdmService {
  constructor(
    private deviceService: DeviceService,
    private applicationService: ApplicationService,
    private xmlParserService: XmlParserService,
  ) {}

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
    const { UDID, Identifier, Status } = responseData;
    
    // Find the device
    const device = await this.deviceService.findByUdid(UDID);
    
    if (!device) {
      throw new Error(`Device with UDID ${UDID} not found`);
    }

    // Update or create the application record
    const appData = {
      identifier: Identifier,
      isManaged: Status === 'Acknowledged',
      deviceId: device.id,
      metadata: responseData,
    };

    return this.applicationService.createOrUpdate(appData);
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
}