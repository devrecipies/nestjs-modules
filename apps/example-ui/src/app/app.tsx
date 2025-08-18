import { Container, Typography, Button, Box } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';

export function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Example UI
        </Typography>
        <Typography variant="body1" gutterBottom>
          This is a simple React app with Material-UI components.
        </Typography>
        <Button
          variant="contained"
          startIcon={<HomeIcon />}
          sx={{ mt: 2 }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
}

export default App;
