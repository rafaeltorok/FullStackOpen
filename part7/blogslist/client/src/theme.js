import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    primary: {
      main: '#90caf9', // soft blue (easy on eyes)
    },
    secondary: {
      main: '#f48fb1',
    },
  },
});

export default theme;
