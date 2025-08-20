import { Typography, Paper, Button } from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import { CurlCommandProps } from './types';

export function CurlCommandDisplay({ command, onCopy, disabled = false }: CurlCommandProps) {
  return (
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
        {command}
      </Typography>

      <Button
        variant="contained"
        startIcon={<CopyIcon />}
        onClick={onCopy}
        sx={{ mt: 2 }}
        disabled={disabled}
      >
        Copy
      </Button>
    </Paper>
  );
}