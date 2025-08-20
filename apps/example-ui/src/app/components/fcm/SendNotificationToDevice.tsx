import { useState } from 'react';
import { Typography } from '@mui/material';
import { DeviceTokenDisplay } from './DeviceTokenDisplay';
import { CurlCommandDisplay } from './CurlCommandDisplay';

interface SendNotificationToDeviceProps {
  deviceToken: string;
  onCopySuccess: () => void;
}

export function SendNotificationToDevice({ deviceToken, onCopySuccess }: SendNotificationToDeviceProps) {
  const generateCurlCommand = () => {
    return `curl -X POST http://localhost:5656/api/send-notification \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Test FCM Notification",
    "body": "This is a real test notification!",
    "token": "${deviceToken}",
    "data": {
      "userId": "123",
      "actionType": "message",
      "deepLink": "/messages/456"
    }
  }'`;
  };

  const handleCopyCurl = async () => {
    const curlCommand = generateCurlCommand();
    
    try {
      await navigator.clipboard.writeText(curlCommand);
      onCopySuccess();
    } catch (err) {
      console.error('Failed to copy curl command:', err);
    }
  };

  return (
    <>
      <DeviceTokenDisplay token={deviceToken} />

      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
        Send Notification to Device
      </Typography>

      <CurlCommandDisplay
        command={generateCurlCommand()}
        onCopy={handleCopyCurl}
        disabled={!deviceToken}
      />
    </>
  );
}