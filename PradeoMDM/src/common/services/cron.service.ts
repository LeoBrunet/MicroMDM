import { Injectable } from '@nestjs/common';
import * as cron from 'node-cron';
import { DeviceService } from '../../devices/services/device.service';
import { ApplicationMdmService } from '../../applications/services/application.mdm.service';

@Injectable()
export class CronService {
  constructor(
    private readonly deviceService: DeviceService,
    private readonly applicationMdmService: ApplicationMdmService
  ) {
    this.scheduleTasks();
  }

  scheduleTasks() {
    cron.schedule('0 * * * *', async () => {
      console.log('Get applications - ' + new Date());
      const devices = await this.deviceService.findAll();
      
      for (const device of devices) {
        await this.applicationMdmService.sendAppListCommand({ udid: device.udid });
      }
    });
  }
}