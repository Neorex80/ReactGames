import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF5722', // Your primary color (orange)
    },
    secondary: {
      main: '#000000', // White for contrast
    },
    background: {
      default: '#1a1a1a', // Dark background for the whole app
      paper: '#2c2c2c', // Darker grey for paper components
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h3: {
      color: '#FF5722', // Orange heading color
    },
  },
});

export default theme;
