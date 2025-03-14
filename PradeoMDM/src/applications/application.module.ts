import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './application.entity';
import { ApplicationService } from './services/application.service';
import { ApplicationMdmService } from './services/application.mdm.service';
import { ApplicationController } from './controllers/application.controller';
import { ApplicationMdmController } from './controllers/application.mdm.controller';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { DeviceModule } from '../devices/device.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    ConfigModule,
    HttpModule,
    DeviceModule,
  ],
  providers: [ApplicationService, ApplicationMdmService],
  controllers: [ApplicationController, ApplicationMdmController],
  exports: [ApplicationService, ApplicationMdmService],
})
export class ApplicationModule {}