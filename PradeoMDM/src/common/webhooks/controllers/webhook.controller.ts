import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WebhookHandlerService } from '../services/webhook-handler.service';
import { XmlParserService } from '../../services/xml-parser.service';

@Controller('webhook')
export class WebhookController {
  constructor(
    private webhookHandlerService: WebhookHandlerService,
    private xmlParserService: XmlParserService,
  ) {}

  @Post('mdm')
  @HttpCode(HttpStatus.OK)
  async mdmWebhook(@Body() data: any) {
    const payloadDict = this.xmlParserService.parsePayload(data);
    if (!payloadDict) {
      return { status: "error", message: "Invalid payload" };
    }
    
    return this.webhookHandlerService.handleMdmWebhook(payloadDict);
  }
}