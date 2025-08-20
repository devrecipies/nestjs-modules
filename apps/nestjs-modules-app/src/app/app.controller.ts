import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { FcmService } from '@devrecipies/nestjs-modules';

interface SendMessageDto {
  title: string;
  body: string;
  token: string;
  data?: { [key: string]: string };
}

interface SendToMultipleDevicesDto {
  title: string;
  body: string;
  tokens: string[];
  data?: { [key: string]: string };
}

interface SendToTopicDto {
  title: string;
  body: string;
  topic: string;
  data?: { [key: string]: string };
}

interface TopicSubscriptionDto {
  tokens: string[];
  topic: string;
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
      const { title, body, token, data } = sendMessageDto;

      const response = await this.fcmService.sendToDevice(token, {
        notification: {
          title,
          body,
        },
        data,
      });

      return {
        success: true,
        messageId: response,
        message: 'Notification sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to send notification',
      };
    }
  }

  @Post('send-to-multiple-devices')
  async sendToMultipleDevices(
    @Body() sendToMultipleDevicesDto: SendToMultipleDevicesDto
  ) {
    try {
      const { title, body, tokens, data } = sendToMultipleDevicesDto;

      const response = await this.fcmService.sendToMultipleDevices(tokens, {
        notification: {
          title,
          body,
        },
        data,
      });

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses,
        message: `Messages sent to ${response.successCount}/${tokens.length} devices`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to send notifications to multiple devices',
      };
    }
  }

  @Post('send-to-topic')
  async sendToTopic(@Body() sendToTopicDto: SendToTopicDto) {
    try {
      const { title, body, topic, data } = sendToTopicDto;

      const response = await this.fcmService.sendToTopic(topic, {
        notification: {
          title,
          body,
        },
        data,
      });

      return {
        success: true,
        messageId: response,
        message: `Message sent successfully to topic '${topic}'`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to send message to topic',
      };
    }
  }

  @Post('subscribe-to-topic')
  async subscribeToTopic(@Body() topicSubscriptionDto: TopicSubscriptionDto) {
    try {
      const { tokens, topic } = topicSubscriptionDto;

      const response = await this.fcmService.subscribeToTopic(tokens, topic);

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        message: `Subscribed ${response.successCount}/${tokens.length} devices to topic '${topic}'`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to subscribe devices to topic',
      };
    }
  }

  @Post('unsubscribe-from-topic')
  async unsubscribeFromTopic(
    @Body() topicSubscriptionDto: TopicSubscriptionDto
  ) {
    try {
      const { tokens, topic } = topicSubscriptionDto;

      const response = await this.fcmService.unsubscribeFromTopic(
        tokens,
        topic
      );

      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        message: `Unsubscribed ${response.successCount}/${tokens.length} devices from topic '${topic}'`,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to unsubscribe devices from topic',
      };
    }
  }
}
