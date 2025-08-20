import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { Message as MessageIcon } from '@mui/icons-material';
import { MessageListenerProps } from './types';

export function MessageListener({ messages }: MessageListenerProps) {
  return (
    <>
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
                        {message.data && Object.keys(message.data).length > 0 && (
                          <>
                            <br />
                            <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                              <strong>Custom Data:</strong>
                              <Box component="pre" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', mt: 0.5, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                                {JSON.stringify(message.data, null, 2)}
                              </Box>
                            </Typography>
                          </>
                        )}
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
    </>
  );
}