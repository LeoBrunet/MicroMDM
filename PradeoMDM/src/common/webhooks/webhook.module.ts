import { Module } from '@nestjs/common';
import { WebhookController } from './controllers/webhook.controller';
import { WebhookHandlerService } from './services/webhook-handler.service';
import { XmlParserService } from '../services/xml-parser.service';
import { ApplicationModule } from 'src/applications/application.module';
import { DeviceModule } from 'src/devices/device.module';

@Module({
  imports: [
    ApplicationModule,
    DeviceModule
  ],
  controllers: [WebhookController],
  providers: [WebhookHandlerService, XmlParserService],
  exports: [WebhookHandlerService],
})
export class WebhookModule {}