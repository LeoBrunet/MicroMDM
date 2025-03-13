import { Module } from '@nestjs/common';
import { MdmController } from './mdm.controller';
import { MdmService } from './mdm.service';
import { XmlParserService } from './xml-parser.service';
import { DeviceModule } from '../devices/device.module';
import { ApplicationModule } from '../applications/application.module';

@Module({
  imports: [DeviceModule, ApplicationModule],
  controllers: [MdmController],
  providers: [MdmService, XmlParserService],
})
export class MdmModule {}