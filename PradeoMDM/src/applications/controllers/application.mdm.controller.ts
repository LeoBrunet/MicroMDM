import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApplicationMdmService } from '../services/application.mdm.service';
import { AppListRequestDto } from '../dto/app-list.dto';

@Controller('mdm/applications')
export class ApplicationMdmController {
  constructor(private applicationMdmService: ApplicationMdmService) {}

  @Post('list')
  @HttpCode(HttpStatus.OK)
  async getApplicationList(@Body() appListDto: AppListRequestDto) {
    return await this.applicationMdmService.sendAppListCommand(appListDto);
  }
}