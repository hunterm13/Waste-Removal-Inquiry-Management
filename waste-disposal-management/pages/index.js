"use client";
import React, { useState, useEffect } from "react";
import { Button, Container,  Typography } from "@mui/material";

export default function Home() {
  const [username, setUsername] = useState("");

  const handleNav = () => {
    window.location.href = "/employeeLanding";
  };

  return (
    <Container maxWidth="xl">
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" align="center">
            Welcome to 310 Dump
            </Typography>
        </Container>
        <Container maxWidth="l">
            <Typography variant="body1" component="p" align="center">
              <Button variant="contained" color="primary" onClick={handleNav}>
                Go to Landing
              </Button>
            </Typography>
            
        </Container>
    </Container>
  );
}