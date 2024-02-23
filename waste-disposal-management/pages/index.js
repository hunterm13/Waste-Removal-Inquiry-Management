'use client';
import React, { useState, useEffect } from 'react';
import { Button, Container,  Typography } from '@mui/material';

export default function Home() {
  const [username, setUsername] = useState('');

  const handleNav = () => {
    window.location.href = '/employeeLanding';
  };

  return (
    <Container maxWidth="xl">
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" align="center">
            Welcome to Unnamed Waste Disposal Company
            </Typography>
        </Container>
        <Container maxWidth="l">
            <Typography variant="body1" component="p" align="center">
            We specialize in waste removal and management services.
            </Typography>
            <Typography variant="body1" component="p" align="center">
            Username: {username}
            </Typography>
            <Button variant="contained" color="primary" onClick={handleNav}>
            Go to Landing
            </Button>
        </Container>
    </Container>
  );
}