// Import required modules
import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { Raleway, Roboto } from "next/font/google";
import  NavBar  from "../components/navBar";

export const raleway = Raleway({
    weight: "400",
    subsets: ["latin"],
  });

export const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
  });

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
          main: "#dcd439",
        },
        secondary: {
          main: "#ff6d00",
        },
        alert: {
            main: "#ff0000",
        },
        tertiary: {
            main: "#006400",
        },
        background: {
            default: "#3b3a3a",
            paper: "#3d3d3d",
        },
      },
      typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
          fontFamily: raleway.style.fontFamily
        },
        h2: {
            fontFamily: raleway.style.fontFamily
        },
        h3: {
            fontFamily: raleway.style.fontFamily
        },
        
    },
});

export default function MyApp({ Component, pageProps }) {
    return <>
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar/>
            <Component {...pageProps} />
        </ThemeProvider>
    </>;
}
