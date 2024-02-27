"use client";
import React, { useState, useEffect, use } from "react";
import { Typography, Container, CircularProgress } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";
import { FormControl, InputLabel, Input, Button } from "@mui/material";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                window.location.href = "/employeeLanding";
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <Container maxWidth='sm' sx={{ marginTop: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <CircularProgress sx={{ marginBottom: 2 }} />
            </Container>
        );
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/employeeLanding";
        } catch (error) {
            switch (error.code) {
                case "auth/invalid-email":
                    setError("Invalid email address.");
                    break;
                case "auth/invalid-credential":
                    setError("Incorrect login details.");
                    break;
                case "auth/missing-password":
                    setError("Invalid password.");
                    break;
                default:
                    setError("Unknown error occurred. Please try again or contact support.");
                    break;
            }
        }
    };

    return (
        <Container maxWidth='sm' sx={{ marginTop: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="h3" sx={{ marginBottom: 2 }}>Login</Typography>
            {error && <Typography variant="body1" color="error" sx={{ marginBottom: 2 }}>{error}</Typography>}
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                <FormControl sx={{ marginBottom: 2, width: "60%" }}>
                    <InputLabel>Email</InputLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl sx={{ marginBottom: 2, width: "60%" }}>
                    <InputLabel>Password</InputLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormControl>
                <Button type="submit" variant="contained" sx={{ marginBottom: 2 }}>
                    Login
                </Button>
            </form>
            <Typography variant="body2" sx={{ marginTop: 2 }}>New employee? <Button href="/signUp">Sign up here.</Button></Typography>
        </Container>
    );
}