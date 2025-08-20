import { useState, useEffect } from 'react';
import { Typography, Box, Tabs, Tab, Snackbar, Alert } from '@mui/material';
import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './firebase-config';
import { SendNotificationToDevice } from './components/fcm/SendNotificationToDevice';
import { SendToTopicComponent } from './components/fcm/SendToTopicComponent';
import { MessageListener } from './components/fcm/MessageListener';
import { ReceivedMessage } from './components/fcm/types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`fcm-tabpanel-${index}`}
      aria-labelledby={`fcm-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export function FcmComponent() {
  const [deviceToken, setDeviceToken] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [messages, setMessages] = useState<ReceivedMessage[]>([]);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const generateToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging);
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
        data: payload.data,
      };

      setMessages((prev) => [newMessage, ...prev]);
    });

    return () => unsubscribe();
  }, []);

  const handleCopySuccess = () => {
    setCopySuccess(true);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCloseSnackbar = () => {
    setCopySuccess(false);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Firebase Cloud Messaging
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="FCM testing tabs"
        >
          <Tab label="Send to Device" />
          <Tab label="Send to Topic" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <SendNotificationToDevice
          deviceToken={deviceToken}
          onCopySuccess={handleCopySuccess}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <SendToTopicComponent 
          deviceToken={deviceToken}
          onCopySuccess={handleCopySuccess} 
        />
      </TabPanel>

      <MessageListener messages={messages} />

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Command copied to clipboard!
        </Alert>
      </Snackbar>
    </Box>
  );
}
