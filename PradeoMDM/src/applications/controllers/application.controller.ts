import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import { NotFoundException } from '@nestjs/common';

@Controller('applications')
export class ApplicationController {
  constructor(private applicationService: ApplicationService) {}

  @Get()
  async getApplications() {
    return this.applicationService.findAll();
  }

  @Get('device/:udid')
  async getAppsByDeviceUDID(@Param('udid') udid: string) {
    return await this.applicationService.findByDeviceUDID(udid);
  }

  @Get('device/:udid/:identifier')
  async getAppByDeviceAndIdentifier(
    @Param('udid') udid: string,
    @Param('identifier') identifier: string
  ) {
    return await this.applicationService.findByDeviceUdidAndIdentifier(udid, identifier);
  }
}