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

## 🔥 Firebase Cloud Messaging (FCM) Module

Send push notifications to mobile devices and web browsers using Firebase Cloud Messaging.

### Features

- ✅ Send notifications to individual devices
- ✅ Send notifications to multiple devices  
- ✅ Built-in error handling
- ✅ TypeScript support
- ✅ Easy configuration

### Quick Start

1. **Install Firebase Admin SDK**:
```bash
npm install firebase-admin
```

2. **Configure the module**:
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
      },
    }),
  ],
})
export class AppModule {}
```

3. **Use the service**:
```typescript
import { Injectable } from '@nestjs/common';
import { FcmService } from '@devrecipies/nestjs-modules';

@Injectable()
export class NotificationService {
  constructor(private readonly fcmService: FcmService) {}

  async sendNotification() {
    const deviceToken = 'user-device-token';
    
    const result = await this.fcmService.sendToDevice(deviceToken, {
      notification: {
        title: 'Hello!',
        body: 'This is a test notification',
      },
      data: {
        customKey: 'customValue',
      },
    });
    
    return result;
  }
}
```

### API Endpoints Example

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { FcmService } from '@devrecipies/nestjs-modules';

@Controller()
export class AppController {
  constructor(private readonly fcmService: FcmService) {}

  @Post('send-notification')
  async sendNotification(@Body() dto: { title: string; body: string; token: string }) {
    try {
      const result = await this.fcmService.sendToDevice(dto.token, {
        notification: {
          title: dto.title,
          body: dto.body,
        },
      });

      return { success: true, messageId: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## Configuration Options

### Environment Variables
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
```

### Service Account File
```typescript
FcmModule.forRoot({
  config: {
    serviceAccountPath: './path/to/serviceAccount.json'
  }
})
```

## Frontend Integration

### React + Firebase Setup

1. **Install Firebase SDK**:
```bash
npm install firebase
```

2. **Configure Firebase**:
```typescript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com", 
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Get FCM token
const token = await getToken(messaging, { 
  vapidKey: 'your-vapid-key' 
});

// Listen for messages
onMessage(messaging, (payload) => {
  console.log('Message received:', payload);
});
```

3. **Test with cURL**:
```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "body": "This is a test!",
    "token": "your-device-token"
  }'
```

## API Reference

### FcmService Methods

#### `sendToDevice(token: string, message: FcmMessage): Promise<string>`
Send a notification to a single device.

#### `sendToMultipleDevices(tokens: string[], message: FcmMessage): Promise<any>`
Send a notification to multiple devices.

### Message Interface
```typescript
interface FcmMessage {
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
  };
  data?: { [key: string]: string };
  android?: AndroidConfig;
  ios?: IosConfig;
  webpush?: WebpushConfig;
}
```

## Examples

- [Complete Backend Example](https://github.com/your-repo/nestjs-modules/tree/main/apps/nestjs-modules-app)
- [React Frontend Example](https://github.com/your-repo/nestjs-modules/tree/main/apps/example-ui)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/your-repo/nestjs-modules).
