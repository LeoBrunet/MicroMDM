import { Controller, Get, Param, Query } from '@nestjs/common';
import { DeviceService } from '../services/device.service';

@Controller('devices')
export class DeviceController {
  constructor(private deviceService: DeviceService) {}

  @Get(':udid')
  async getDeviceByUdid(@Param('udid') udid: string) {
    return this.deviceService.findByUdid(udid);
  }
}