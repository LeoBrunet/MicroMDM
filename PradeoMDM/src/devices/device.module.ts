import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './device.entity';
import { DeviceService } from './services/device.service';
import { DeviceController } from './controllers/device.controller';
import { DeviceMdmController } from './controllers/device.mdm.controller';
import { DeviceMdmService } from './services/device.mdm.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ApplicationModule } from 'src/applications/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device]),
    ConfigModule,
    HttpModule,
    forwardRef(() => ApplicationModule),
  ],
  providers: [DeviceService, DeviceMdmService],
  controllers: [DeviceController, DeviceMdmController],
  exports: [DeviceService, DeviceMdmService],
})
export class DeviceModule {}