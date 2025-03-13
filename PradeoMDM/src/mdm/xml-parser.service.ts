import { Injectable } from '@nestjs/common';
import * as plist from 'plist';

@Injectable()
export class XmlParserService {
  parseAuthenticatePlist(base64Payload: string): any {
    try {
      const buffer = Buffer.from(base64Payload, 'base64');
      const xmlString = buffer.toString('utf-8');
      return plist.parse(xmlString);
    } catch (error) {
      throw new Error(`Failed to parse plist: ${error.message}`);
    }
  }
}