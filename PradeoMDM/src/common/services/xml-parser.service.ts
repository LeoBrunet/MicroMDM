import { Injectable, Logger } from '@nestjs/common';
import * as plist from 'plist';

@Injectable()
export class XmlParserService {
   
  protected readonly logger = new Logger(XmlParserService.name);

  parsePayload(data: any): any {
    if (!data) {
      this.logger.error("Invalid JSON structure or missing fields");
      return null;
    }

    const rawPayload = data?.acknowledge_event?.raw_payload || data?.checkin_event?.raw_payload;
    if (!rawPayload) return null;

    try {
      const decodedPayload = Buffer.from(rawPayload, 'base64').toString();
      const payloadDict = plist.parse(decodedPayload);
      this.logger.log(`Parsed payload: ${JSON.stringify(payloadDict)}`);
      return payloadDict;
    } catch (e) {
      this.logger.error(`Error parsing payload: ${e}`);
      return null;
    }
  }
}