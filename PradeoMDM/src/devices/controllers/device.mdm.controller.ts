import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { DeviceMdmService } from '../services/device.mdm.service';
import { AuthenticateEventDto } from '../dto/device.dto';
import { ManageDto } from '../dto/manage.dto';

@Controller('mdm/devices')
export class DeviceMdmController {
  constructor(private deviceMdmService: DeviceMdmService) {}

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() eventData: AuthenticateEventDto) {
    return this.deviceMdmService.handleAuthenticate(eventData);
  }

  @Post('manage')
  @HttpCode(HttpStatus.OK)
  async manageApp(@Body() manageDto: ManageDto) {
    return await this.deviceMdmService.sendManageAppCommand(manageDto);
  }
}