import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  getMessaging,
  BatchResponse,
  MessagingTopicManagementResponse,
} from 'firebase-admin/messaging';
import type { FcmConfig } from './interfaces/fcm-config.interface';
import type { FcmMessage } from './interfaces/fcm-message.interface';

@Injectable()
export class FcmService implements OnModuleInit {
  private readonly logger = new Logger(FcmService.name);
  private app!: admin.app.App;
  private messaging!: admin.messaging.Messaging;

  constructor(private readonly config: FcmConfig) {}

  async onModuleInit(): Promise<void> {
    await this.initializeFirebaseApp();
  }

  private async initializeFirebaseApp(): Promise<void> {
    try {
      this.app = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: this.config.projectId,
          clientEmail: this.config.clientEmail,
          privateKey: this.config.privateKey.replace(/\\n/g, '\n'),
        }),
      });

      this.messaging = getMessaging(this.app);
      this.logger.log('Firebase Admin SDK and FCM initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Firebase Admin SDK', error);
      this.logger.warn(
        'FCM service will not be available - check your Firebase configuration'
      );
      // Don't throw error to prevent app crash during development
    }
  }

  async sendToDevice(token: string, message: FcmMessage): Promise<string> {
    if (!this.messaging) {
      throw new Error(
        'FCM service is not initialized. Check your Firebase configuration.'
      );
    }

    try {
      const response = await this.messaging.send({
        token,
        ...message,
      });
      this.logger.log(`Message sent successfully to device: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Failed to send message to device', error);
      throw error;
    }
  }

  async sendToMultipleDevices(
    tokens: string[],
    message: FcmMessage
  ): Promise<BatchResponse> {
    try {
      const response = await this.messaging.sendEachForMulticast({
        tokens,
        ...message,
      });
      this.logger.log(
        `Messages sent to ${response.successCount}/${tokens.length} devices`
      );
      return response;
    } catch (error) {
      this.logger.error('Failed to send messages to multiple devices', error);
      throw error;
    }
  }

  async sendToTopic(topic: string, message: FcmMessage): Promise<string> {
    try {
      const response = await this.messaging.send({
        topic,
        ...message,
      });
      this.logger.log(
        `Message sent successfully to topic '${topic}': ${response}`
      );
      return response;
    } catch (error) {
      this.logger.error(`Failed to send message to topic '${topic}'`, error);
      throw error;
    }
  }

  async subscribeToTopic(
    tokens: string[],
    topic: string
  ): Promise<MessagingTopicManagementResponse> {
    try {
      const response = await this.messaging.subscribeToTopic(tokens, topic);
      this.logger.log(
        `Subscribed ${response.successCount}/${tokens.length} devices to topic '${topic}'`
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to subscribe devices to topic '${topic}'`,
        error
      );
      throw error;
    }
  }

  async unsubscribeFromTopic(
    tokens: string[],
    topic: string
  ): Promise<MessagingTopicManagementResponse> {
    try {
      const response = await this.messaging.unsubscribeFromTopic(tokens, topic);
      this.logger.log(
        `Unsubscribed ${response.successCount}/${tokens.length} devices from topic '${topic}'`
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to unsubscribe devices from topic '${topic}'`,
        error
      );
      throw error;
    }
  }
}
