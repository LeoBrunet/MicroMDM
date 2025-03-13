import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApplicationService } from './application.service';

@Controller('applications')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Get('device/:deviceId/app/:identifier')
  async getAppByDeviceAndIdentifier(
    @Param('deviceId') deviceId: number,
    @Param('identifier') identifier: string,
  ) {
    return this.applicationService.findByDeviceAndIdentifier(deviceId, identifier);
  }
}