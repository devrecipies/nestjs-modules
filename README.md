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
    FcmModule.register({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      // Or use service account file path
      // serviceAccountPath: './path/to/serviceAccount.json'
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
}

@Controller()
export class AppController {
  constructor(private readonly fcmService: FcmService) {}

  @Post('send-notification')
  async sendNotification(@Body() dto: SendNotificationDto) {
    try {
      const result = await this.fcmService.sendToDevice(dto.token, {
        notification: {
          title: dto.title,
          body: dto.body,
        },
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
}
```

## Frontend Integration

### React + Firebase Example

Here's how to integrate with a React frontend to receive FCM tokens and messages:

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

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test FCM Notification",
    "body": "This is a real test notification!",
    "token": "your-device-token-here"
  }'
```

## Examples

- **Backend Example**: See `apps/nestjs-modules-app/` for a complete NestJS application example
- **Frontend Example**: See `apps/example-ui/` for a complete React application example

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

If you encounter any issues or have questions, please file an issue on our [GitHub repository](https://github.com/your-repo/nestjs-modules).
