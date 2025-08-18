import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { FcmService } from '@devrecipies/nestjs-modules';

interface SendMessageDto {
  title: string;
  body: string;
  token: string;
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fcmService: FcmService
  ) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Post('send-notification')
  async sendNotification(@Body() sendMessageDto: SendMessageDto) {
    try {
      const { title, body, token } = sendMessageDto;

      const response = await this.fcmService.sendToDevice(token, {
        notification: {
          title,
          body,
        },
      });

      return {
        success: true,
        messageId: response,
        message: 'Notification sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to send notification',
      };
    }
  }
}
