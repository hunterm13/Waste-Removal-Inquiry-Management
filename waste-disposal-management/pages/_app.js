// Import required modules
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material';
import { Raleway } from '@next/font/google';
import  NavBar  from '../components/navBar';

export const raleway = Raleway({
    weight: '400',
    subsets: ['latin'],
  });

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
      typography: {
        fontFamily: raleway.style.fontFamily,
    },
});

export default function MyApp({ Component, pageProps }) {
    return <>
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar/>
            <Component {...pageProps} />
        </ThemeProvider>
    </>
}
