import { Typography, Paper } from '@mui/material';
import { DeviceTokenDisplayProps } from './types';

export function DeviceTokenDisplay({ token }: DeviceTokenDisplayProps) {
  return (
    <>
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
          {token}
        </Typography>
      </Paper>
    </>
  );
}