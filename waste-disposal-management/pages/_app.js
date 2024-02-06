// Import required modules
import React from 'react';
import { ThemeProvider } from 'styled-components';
import theme from '../utils/theme';

// Create a custom App component
export default function MyApp({ Component, pageProps }) {
    console.log('this is being used')
    return <>
        <ThemeProvider theme={theme}>
        <Component {...pageProps} />;
        </ThemeProvider>
    </>
    
}
