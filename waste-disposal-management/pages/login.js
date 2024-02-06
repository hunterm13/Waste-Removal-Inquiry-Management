'use client';
import React, { useState } from "react";
import { Typography, TextField, Button, Container, ThemeProvider } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../src/app/firebaseConfig";
import theme from "../utils/theme";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to the desired page after successful login
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth='sm'>
                <Typography variant="h4">Login</Typography>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="main" onClick={handleLogin}>
                    Login
                </Button>
            </Container>
        </ThemeProvider>
    );
}