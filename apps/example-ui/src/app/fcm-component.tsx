import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Button,
  Paper,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase-config';

interface ReceivedMessage {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
}

export function FcmComponent() {
  const [deviceToken, setDeviceToken] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [messages, setMessages] = useState<ReceivedMessage[]>([]);

  useEffect(() => {
    const generateToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: '****',
          });
          if (token) {
            setDeviceToken(token);
          } else {
            setDeviceToken('No registration token available.');
          }
        } else {
          setDeviceToken('Permission not granted for notifications.');
        }
      } catch (error) {
        console.error('An error occurred while retrieving token:', error);
        setDeviceToken(
          `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    };

    generateToken();
  }, []);

  useEffect(() => {
    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received in foreground:', payload);

      const newMessage: ReceivedMessage = {
        id: Date.now().toString(),
        title: payload.notification?.title || 'No Title',
        body: payload.notification?.body || 'No Body',
        timestamp: new Date(),
      };

      setMessages((prev) => [newMessage, ...prev]);
    });

    return () => unsubscribe();
  }, []);

  const handleCopyCurl = async () => {
    const curlCommand = `curl -X POST http://localhost:5656/api/send-notification \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Test FCM Notification",
    "body": "This is a real test notification!",
    "token": "${deviceToken}"
  }'`;

    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopySuccess(true);
    } catch (err) {
      console.error('Failed to copy curl command:', err);
    }
  };

  const handleCloseSnackbar = () => {
    setCopySuccess(false);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Firebase Cloud Messaging
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
        Device Token
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mt: 2,
          border: '1px solid #ccc',
          wordBreak: 'break-all',
        }}
      >
        <Typography
          variant="body2"
          component="p"
          sx={{
            fontFamily: 'monospace',
            textAlign: 'left',
          }}
        >
          {deviceToken}
        </Typography>
      </Paper>

      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
        Test Command
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: 2,
          mt: 2,
          border: '1px solid #ccc',
          wordBreak: 'break-all',
        }}
      >
        <Typography
          variant="body2"
          component="pre"
          sx={{
            fontFamily: 'monospace',
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
            margin: 0,
          }}
        >
          {`curl -X POST http://localhost:5656/api/send-notification \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Test FCM Notification",
    "body": "This is a real test notification!",
    "token": "${deviceToken}"
  }'`}
        </Typography>

        <Button
          variant="contained"
          startIcon={<CopyIcon />}
          onClick={handleCopyCurl}
          sx={{ mt: 2 }}
          disabled={!deviceToken}
        >
          Copy
        </Button>
      </Paper>

      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 4 }}>
        Received Messages
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          mt: 2,
          border: '1px solid #ccc',
          maxHeight: 400,
          overflow: 'auto',
        }}
      >
        {messages.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <MessageIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
            <Typography variant="body2" color="grey.600">
              No messages received yet
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message, index) => (
              <div key={message.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={message.title}
                    secondary={
                      <>
                        <Typography variant="body2" component="span">
                          {message.body}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {message.timestamp.toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < messages.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        )}
      </Paper>

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Token copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}
