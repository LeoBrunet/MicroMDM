import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { MdmService } from './mdm.service';
import { ManageAppDto } from './dto/manage-app.dto';
import { AppListRequestDto } from './dto/app-list.dto';
import { AuthenticateEventDto } from './dto/authenticate.dto';
import * as plist from 'plist'; // You'll need to install this: npm install plist

@Controller('mdm')
export class MdmController {
  private readonly logger = new Logger(MdmController.name);
  
  constructor(private mdmService: MdmService) {}

  // Central webhook handler for all MDM events
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(@Body() data: any) {

    console.log(data)

    if (!data) {
      this.logger.error("Invalid JSON structure or missing fields");
      return { 
        status: "error", 
        message: "Invalid JSON structure or missing fields" 
      };
    }

    const rawPayload = data?.acknowledge_event?.raw_payload || data?.checkin_event?.raw_payload;
    let payloadDict;

    try {
      // Decode base64 to get XML/plist data
      const decodedPayload = Buffer.from(rawPayload, 'base64').toString();
      
      // Parse the XML/plist data
      payloadDict = plist.parse(decodedPayload);
      this.logger.log(`Parsed payload: ${JSON.stringify(payloadDict)}`);
    } catch (e) {
      this.logger.error(`Error parsing payload: ${e}`);
      return { 
        status: "error", 
        message: `Invalid payload: ${e.message}` 
      };
    }

    // Determine the command type from the payload
    let commandType = null;
    
    if (payloadDict.InstalledApplicationList) {
      commandType = 'InstalledApplicationList';
    } else if (payloadDict.ManageAppResponse) {
      commandType = 'ManageAppResponse';
    } else if (payloadDict.MessageType == "Authenticate") {
      commandType = 'AuthenticationResponse';
    } else if (payloadDict.MessageType == "CheckOut") {
      commandType = 'CheckOutResponse'
      // TODO delete device from database
    }

    if (commandType) {
      this.logger.log(`CommandType: ${commandType}`);
    } else {
      this.logger.log("No CommandType found in the payload.");
    }

    // Map command types to handler methods
    const commandTypeMap = {
      'InstalledApplicationList': () => this.handleInstalledApplicationList(payloadDict),
      'ManageAppResponse': () => this.handleManageAppResponse(payloadDict),
      'AuthenticationResponse': () => this.handleAuthenticationResponse(payloadDict)
    };

    // Execute the corresponding handler if command type exists
    if (commandType && commandTypeMap[commandType]) {
      return commandTypeMap[commandType]();
    } else {
      return { 
        status: "success", 
        message: "No action required for the given payload" 
      };
    }
  }

  // Handler methods
  private handleInstalledApplicationList(payload: any) {
    const udid = payload.UDID || '';
    return this.mdmService.handleInstalledAppList(payload, udid);
  }

  private handleManageAppResponse(payload: any) {
    return this.mdmService.handleManageAppResult(payload);
  }

  private handleAuthenticationResponse(payload: any) {
    console.log('Parsed payload:', payload); // Log the payload to inspect
    const udid = payload.UDID || '';
    return this.mdmService.handleAuthenticate(payload);
  }

  // Keep individual endpoints for backward compatibility or direct access
  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  async authenticate(@Body() eventData: AuthenticateEventDto) {
    return this.mdmService.handleAuthenticate(eventData);
  }

  @Post('manage')
  @HttpCode(HttpStatus.OK)
  async manageApp(@Body() manageAppDto: ManageAppDto) {
    return {
      message: 'Command sent to manage application',
      udid: manageAppDto.udid,
      identifier: manageAppDto.identifier,
    };
  }

  @Post('application-list')
  @HttpCode(HttpStatus.OK)
  async getApplicationList(@Body() appListDto: AppListRequestDto) {
    return {
      message: 'Command sent to retrieve application list',
      udid: appListDto.udid,
    };
  }
}