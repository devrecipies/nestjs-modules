# NestJS FCM Demo App

This is a demo application showcasing the Firebase Cloud Messaging (FCM) integration using the `@devrecipies/nestjs-modules` package.

## Features

- ✅ Firebase Admin SDK v12 integration
- ✅ FCM push notification sending
- ✅ Environment-based configuration
- ✅ TypeScript support
- ✅ NestJS lifecycle integration

## Setup

### 1. Environment Configuration

Copy the example environment file and configure your Firebase settings:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase service account details:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

### 2. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) > **Service accounts**
4. Click **"Generate new private key"** to download the JSON file
5. Extract the required values from the JSON file

### 3. Start the Application

```bash
# Install dependencies
npm install

# Start the development server
npx nx serve nestjs-modules-app
```

The app will start on `http://localhost:3000`

## API Endpoints

### Send FCM Notification

**POST** `/send-notification`

Send a push notification to a specific device.

#### Request Body

```json
{
  "title": "Hello World",
  "body": "This is a test notification",
  "token": "device-fcm-token-here"
}
```

#### Response

**Success:**
```json
{
  "success": true,
  "messageId": "projects/your-project/messages/0:1234567890",
  "message": "Notification sent successfully"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Error message here",
  "message": "Failed to send notification"
}
```

### Health Check

**GET** `/`

Returns basic app information.

## Testing with cURL

```bash
curl -X POST http://localhost:3000/send-notification \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Notification",
    "body": "Hello from FCM!",
    "token": "your-device-token-here"
  }'
```

## FCM Integration Details

The app uses the `FcmModule` from `@devrecipies/nestjs-modules` which provides:

- **Proper NestJS lifecycle integration** with `OnModuleInit`
- **Type-safe FCM operations** with TypeScript interfaces
- **Comprehensive error handling** and logging
- **Multiple sending methods** (device, multiple devices, topics)

### Available FCM Methods

- `sendToDevice(token, message)` - Send to single device
- `sendToMultipleDevices(tokens, message)` - Send to multiple devices
- `sendToTopic(topic, message)` - Send to topic subscribers
- `subscribeToTopic(tokens, topic)` - Subscribe devices to topic
- `unsubscribeFromTopic(tokens, topic)` - Unsubscribe devices from topic

## Development

### Build

```bash
npx nx build nestjs-modules-app
```

### Test

```bash
npx nx test nestjs-modules-app
```

### Lint

```bash
npx nx lint nestjs-modules-app
```

## Troubleshooting

### Common Issues

1. **"Invalid project_id"** - Make sure `FIREBASE_PROJECT_ID` matches your Firebase project
2. **"Invalid client_email"** - Verify the service account email is correct
3. **"Invalid private_key"** - Ensure the private key includes proper newlines (`\n`)
4. **"Registration token not found"** - The device token is invalid or expired

### Getting Device Tokens

For testing, you'll need FCM device tokens. You can get these from:
- Your mobile app using Firebase SDK
- Web app using Firebase Web SDK
- Firebase Console for testing

## License

MIT