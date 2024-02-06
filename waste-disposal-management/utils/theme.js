import { createTheme } from '@mui/material';


const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
          main: '#dcd439',
        },
        secondary: {
          main: '#ff6d00',
        },
        background: {
            default: '#3b3a3a',
            paper: '#3d3d3d',
        },
      },
});

export default theme;
