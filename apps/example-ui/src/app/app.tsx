import { Container, Box } from '@mui/material';
import { FcmComponent } from './fcm-component';

export function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4, textAlign: 'left' }}>
        <FcmComponent />
      </Box>
    </Container>
  );
}

export default App;
