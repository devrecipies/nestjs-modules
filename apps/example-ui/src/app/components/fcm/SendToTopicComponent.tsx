import { useState } from 'react';
import { Typography, TextField, Box, Button, Divider } from '@mui/material';
import { CurlCommandDisplay } from './CurlCommandDisplay';

interface SendToTopicComponentProps {
  deviceToken: string;
  onCopySuccess: () => void;
}

export function SendToTopicComponent({ deviceToken, onCopySuccess }: SendToTopicComponentProps) {
  const [topicName, setTopicName] = useState('test-topic');

  const generateCurlCommand = () => {
    return `curl -X POST http://localhost:5656/api/send-to-topic \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Topic Notification",
    "body": "This is a notification sent to topic: ${topicName}",
    "topic": "${topicName}",
    "data": {
      "source": "topic",
      "topicName": "${topicName}",
      "timestamp": "${new Date().toISOString()}"
    }
  }'`;
  };

  const generateSubscribeCurlCommand = () => {
    return `curl -X POST http://localhost:5656/api/subscribe-to-topic \\
  -H "Content-Type: application/json" \\
  -d '{
    "tokens": ["${deviceToken}"],
    "topic": "${topicName}"
  }'`;
  };

  const generateUnsubscribeCurlCommand = () => {
    return `curl -X POST http://localhost:5656/api/unsubscribe-from-topic \\
  -H "Content-Type: application/json" \\
  -d '{
    "tokens": ["${deviceToken}"],
    "topic": "${topicName}"
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

  const handleCopySubscribeCurl = async () => {
    const curlCommand = generateSubscribeCurlCommand();
    
    try {
      await navigator.clipboard.writeText(curlCommand);
      onCopySuccess();
    } catch (err) {
      console.error('Failed to copy subscribe curl command:', err);
    }
  };

  const handleCopyUnsubscribeCurl = async () => {
    const curlCommand = generateUnsubscribeCurlCommand();
    
    try {
      await navigator.clipboard.writeText(curlCommand);
      onCopySuccess();
    } catch (err) {
      console.error('Failed to copy unsubscribe curl command:', err);
    }
  };

  return (
    <>
      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
        Send Notification to Topic
      </Typography>

      <Box sx={{ mt: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Topic Name"
          value={topicName}
          onChange={(e) => setTopicName(e.target.value)}
          placeholder="Enter topic name"
          helperText="Enter the FCM topic name to send notifications to"
        />
      </Box>

      <CurlCommandDisplay
        command={generateCurlCommand()}
        onCopy={handleCopyCurl}
        disabled={!topicName.trim()}
      />

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" component="h2" gutterBottom>
        Topic Management
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Subscribe or unsubscribe this device to/from the topic
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleCopySubscribeCurl}
          disabled={!topicName.trim() || !deviceToken}
          sx={{ flex: 1 }}
        >
          Copy Subscribe Command
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleCopyUnsubscribeCurl}
          disabled={!topicName.trim() || !deviceToken}
          sx={{ flex: 1 }}
        >
          Copy Unsubscribe Command
        </Button>
      </Box>

      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        Subscribe to Topic
      </Typography>
      <CurlCommandDisplay
        command={generateSubscribeCurlCommand()}
        onCopy={handleCopySubscribeCurl}
        disabled={!topicName.trim() || !deviceToken}
      />

      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        Unsubscribe from Topic
      </Typography>
      <CurlCommandDisplay
        command={generateUnsubscribeCurlCommand()}
        onCopy={handleCopyUnsubscribeCurl}
        disabled={!topicName.trim() || !deviceToken}
      />
    </>
  );
}