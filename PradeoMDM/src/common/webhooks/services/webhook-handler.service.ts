// common/webhooks/services/webhook-handler.service.ts
import { Injectable } from '@nestjs/common';
import { DeviceMdmService } from '../../../devices/services/device.mdm.service';
import { ApplicationMdmService } from '../../../applications/services/application.mdm.service';

@Injectable()
export class WebhookHandlerService {
  constructor(
    private deviceMdmService: DeviceMdmService,
    private applicationMdmService: ApplicationMdmService,
  ) {}

  async handleMdmWebhook(payloadDict: any) {
    // Déterminer le type de commande
    let commandType = this.determineCommandType(payloadDict);
    
    // Router vers le service approprié
    switch (commandType) {
      case 'InstalledApplicationList':
        return this.applicationMdmService.handleInstalledAppList(payloadDict, payloadDict.UDID);
      
      case 'ManageAppResponse':
        return this.deviceMdmService.handleManageAppResult(payloadDict);
      
      case 'AuthenticationResponse':
        return this.deviceMdmService.handleAuthenticate(payloadDict);
      
      case 'CheckOutResponse':
        return this.deviceMdmService.handleCheckOut(payloadDict.UDID);
      
      default:
        return { status: "success", message: "No action required" };
    }
  }

  private determineCommandType(payloadDict: any): string {
    if (payloadDict.InstalledApplicationList) {
      return 'InstalledApplicationList';
    } else if (payloadDict.Identifier == "com.pradeo.public.agent") {
      return 'ManageAppResponse';
    } else if (payloadDict.MessageType === "Authenticate") {
      return 'AuthenticationResponse';
    } else if (payloadDict.MessageType === "CheckOut") {
      return 'CheckOutResponse';
    }
    return null;
  }
}