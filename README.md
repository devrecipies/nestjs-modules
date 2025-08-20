# @devrecipies/nestjs-modules

A collection of production-ready NestJS modules for common use cases. This package provides pre-built modules that can be easily integrated into your NestJS applications.

## Installation

```bash
npm install @devrecipies/nestjs-modules
# or
yarn add @devrecipies/nestjs-modules
# or
pnpm add @devrecipies/nestjs-modules
```

## Available Modules

### 🔥 Firebase Cloud Messaging (FCM) Module

Send push notifications to mobile devices and web browsers using Firebase Cloud Messaging.

#### Features

- ✅ Send notifications to individual devices
- ✅ Send notifications to multiple devices
- ✅ Send notifications to topics
- ✅ Subscribe devices to topics
- ✅ Unsubscribe devices from topics
- ✅ Built-in error handling
- ✅ TypeScript support
- ✅ Easy configuration

#### Setup

1. **Install Firebase Admin SDK** (if not already installed):
```bash
npm install firebase-admin
```

2. **Configure Firebase credentials** by setting environment variables or using a service account file:

```bash
# Using environment variables
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key

# Or place your firebase service account JSON file in your project
```

3. **Import and configure the module** in your NestJS application:

```typescript
import { Module } from '@nestjs/common';
import { FcmModule } from '@devrecipies/nestjs-modules';

@Module({
  imports: [
    FcmModule.forRoot({
      config: {
        projectId: process.env.FIREBASE_PROJECT_ID || '',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
        privateKey: process.env.FIREBASE_PRIVATE_KEY || '',
        // Or use service account file path
        // serviceAccountPath: './path/to/serviceAccount.json'
      },
    }),
  ],
})
export class AppModule {}
```

#### Usage

```typescript
import { Injectable } from '@nestjs/common';
import { FcmService } from '@devrecipies/nestjs-modules';

@Injectable()
export class NotificationService {
  constructor(private readonly fcmService: FcmService) {}

  async sendNotification() {
    const deviceToken = 'user-device-token';
    
    try {
      const result = await this.fcmService.sendToDevice(deviceToken, {
        notification: {
          title: 'Hello!',
          body: 'This is a test notification',
        },
        data: {
          customKey: 'customValue',
        },
      });
      
      console.log('Notification sent successfully:', result);
      return result;
    } catch (error) {
      console.error('Failed to send notification:', error);
      throw error;
    }
  }

  async sendToMultipleDevices() {
    const deviceTokens = ['token1', 'token2', 'token3'];
    
    const result = await this.fcmService.sendToMultipleDevices(deviceTokens, {
      notification: {
        title: 'Broadcast Message',
        body: 'This message is sent to multiple devices',
      },
    });

    return result;
  }

  async sendToTopic() {
    const topic = 'news-updates';
    
    const result = await this.fcmService.sendToTopic(topic, {
      notification: {
        title: 'Breaking News',
        body: 'Important news update for all subscribers',
      },
      data: {
        category: 'news',
        priority: 'high',
      },
    });

    return result;
  }

  async subscribeToTopic() {
    const deviceTokens = ['token1', 'token2'];
    const topic = 'news-updates';
    
    const result = await this.fcmService.subscribeToTopic(deviceTokens, topic);
    console.log(`Subscribed ${result.successCount} devices to ${topic}`);
    
    return result;
  }

  async unsubscribeFromTopic() {
    const deviceTokens = ['token1', 'token2'];
    const topic = 'news-updates';
    
    const result = await this.fcmService.unsubscribeFromTopic(deviceTokens, topic);
    console.log(`Unsubscribed ${result.successCount} devices from ${topic}`);
    
    return result;
  }
}
```

#### API Endpoints Example

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { FcmService } from '@devrecipies/nestjs-modules';

interface SendNotificationDto {
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
  constructor(private readonly fcmService: FcmService) {}

  @Post('send-notification')
  async sendNotification(@Body() dto: SendNotificationDto) {
    try {
      const { title, body, token, data } = dto;
      const result = await this.fcmService.sendToDevice(token, {
        notification: { title, body },
        data,
      });

      return {
        success: true,
        messageId: result,
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

  @Post('send-to-multiple-devices')
  async sendToMultipleDevices(@Body() dto: SendToMultipleDevicesDto) {
    try {
      const { title, body, tokens, data } = dto;
      const result = await this.fcmService.sendToMultipleDevices(tokens, {
        notification: { title, body },
        data,
      });

      return {
        success: true,
        successCount: result.successCount,
        failureCount: result.failureCount,
        message: `Messages sent to ${result.successCount}/${tokens.length} devices`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to send notifications to multiple devices',
      };
    }
  }

  @Post('send-to-topic')
  async sendToTopic(@Body() dto: SendToTopicDto) {
    try {
      const { title, body, topic, data } = dto;
      const result = await this.fcmService.sendToTopic(topic, {
        notification: { title, body },
        data,
      });

      return {
        success: true,
        messageId: result,
        message: `Message sent successfully to topic '${topic}'`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to send message to topic',
      };
    }
  }

  @Post('subscribe-to-topic')
  async subscribeToTopic(@Body() dto: TopicSubscriptionDto) {
    try {
      const { tokens, topic } = dto;
      const result = await this.fcmService.subscribeToTopic(tokens, topic);

      return {
        success: true,
        successCount: result.successCount,
        failureCount: result.failureCount,
        message: `Subscribed ${result.successCount}/${tokens.length} devices to topic '${topic}'`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to subscribe devices to topic',
      };
    }
  }

  @Post('unsubscribe-from-topic')
  async unsubscribeFromTopic(@Body() dto: TopicSubscriptionDto) {
    try {
      const { tokens, topic } = dto;
      const result = await this.fcmService.unsubscribeFromTopic(tokens, topic);

      return {
        success: true,
        successCount: result.successCount,
        failureCount: result.failureCount,
        message: `Unsubscribed ${result.successCount}/${tokens.length} devices from topic '${topic}'`,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Failed to unsubscribe devices from topic',
      };
    }
  }
}
```

## Frontend Integration

### React + Firebase Example

Here's how to integrate with a React frontend to receive FCM tokens and messages:

![Frontend Example](./Frontend.png)

#### 1. Install Firebase SDK

```bash
npm install firebase
```

#### 2. Firebase Configuration

```typescript
// firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// Register service worker for background messaging
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered successfully:', registration);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}
```

#### 3. Service Worker (public/firebase-messaging-sw.js)

```javascript
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.1.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

#### 4. React Component

```typescript
import React, { useState, useEffect } from 'react';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase-config';

interface Message {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
}

export function FCMComponent() {
  const [deviceToken, setDeviceToken] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const generateToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: 'your-vapid-key'
          });
          if (token) {
            setDeviceToken(token);
          }
        }
      } catch (error) {
        console.error('Error generating token:', error);
      }
    };

    generateToken();
  }, []);

  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      
      const newMessage: Message = {
        id: Date.now().toString(),
        title: payload.notification?.title || 'No Title',
        body: payload.notification?.body || 'No Body',
        timestamp: new Date()
      };

      setMessages(prev => [newMessage, ...prev]);
    });

    return () => unsubscribe();
  }, []);

  const testNotification = async () => {
    if (!deviceToken) return;

    try {
      const response = await fetch('http://localhost:3000/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: 'Test Notification',
          body: 'This is a test message!',
          token: deviceToken
        }),
      });

      const result = await response.json();
      console.log('Notification sent:', result);
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  return (
    <div>
      <h2>Firebase Cloud Messaging</h2>
      
      <div>
        <h3>Device Token</h3>
        <textarea value={deviceToken} readOnly rows={4} cols={50} />
        <br />
        <button onClick={testNotification} disabled={!deviceToken}>
          Send Test Notification
        </button>
      </div>

      <div>
        <h3>Received Messages</h3>
        {messages.length === 0 ? (
          <p>No messages received yet</p>
        ) : (
          <ul>
            {messages.map((message) => (
              <li key={message.id}>
                <strong>{message.title}</strong>: {message.body}
                <br />
                <small>{message.timestamp.toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

#### 5. Testing with cURL

**Send to Single Device:**
```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test FCM Notification",
    "body": "This is a real test notification!",
    "token": "your-device-token-here",
    "data": {
      "userId": "123",
      "actionType": "message"
    }
  }'
```

**Send to Multiple Devices:**
```bash
curl -X POST http://localhost:3000/send-to-multiple-devices \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broadcast Message",
    "body": "This message is sent to multiple devices",
    "tokens": ["token1", "token2", "token3"],
    "data": {
      "type": "broadcast",
      "priority": "high"
    }
  }'
```

**Send to Topic:**
```bash
curl -X POST http://localhost:3000/send-to-topic \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Topic Notification",
    "body": "This is a notification sent to a topic",
    "topic": "news-updates",
    "data": {
      "category": "news",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  }'
```

**Subscribe to Topic:**
```bash
curl -X POST http://localhost:3000/subscribe-to-topic \
  -H "Content-Type: application/json" \
  -d '{
    "tokens": ["device-token-1", "device-token-2"],
    "topic": "news-updates"
  }'
```

**Unsubscribe from Topic:**
```bash
curl -X POST http://localhost:3000/unsubscribe-from-topic \
  -H "Content-Type: application/json" \
  -d '{
    "tokens": ["device-token-1", "device-token-2"],
    "topic": "news-updates"
  }'
```

## 🐳 Quick Start with Docker

The easiest way to get started is using our pre-built Docker image:

### Option 1: Docker Compose (Recommended)

1. **Create a `docker-compose.yml` file:**
```yaml
version: '3.8'

services:
  nestjs-modules-fcm:
    image: devrecipies/nestjs-modules-fcm:latest
    container_name: nestjs-modules-fcm
    ports:
      - "3130:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      # Firebase configuration - add your actual values to .env file
      - FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID:-your-project-id}
      - FIREBASE_CLIENT_EMAIL=${FIREBASE_CLIENT_EMAIL:-your-service-account@your-project.iam.gserviceaccount.com}
      - FIREBASE_PRIVATE_KEY=${FIREBASE_PRIVATE_KEY:-your-private-key}
    env_file:
      - .env
    restart: unless-stopped
```

2. **Create a `.env` file with your Firebase credentials:**
```bash
FIREBASE_PROJECT_ID=your-actual-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-actual-private-key\n-----END PRIVATE KEY-----"
```

3. **Run the application:**
```bash
docker-compose up -d
```

4. **Access your API:**
- Base URL: `http://localhost:3130`
- API endpoints: `http://localhost:3130/api/`

### Option 2: Direct Docker Run

```bash
docker run -d \
  --name nestjs-modules-fcm \
  -p 3130:3000 \
  --env-file .env \
  devrecipies/nestjs-modules-fcm:latest
```

That's it! Your FCM API server is now running and ready to send notifications.

## Examples

- **Backend Example**: See `apps/nestjs-modules-app/` for a complete NestJS application example
- **Frontend Example**: See `apps/example-ui/` for a complete React application example

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub repository](https://github.com/your-repo/nestjs-modules).
