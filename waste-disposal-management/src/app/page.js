'use client';
import React, { useState, useEffect } from 'react';
import { Button, Container, ThemeProvider, Typography } from '@mui/material';
import { getUserFirstName } from '../../utils/queries';
import Link from 'next/link';
import theme from '../../utils/theme';

export default function Home() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const response = await getUserFirstName('IQrO6zmQkfQC3gcHdNt8iwmgKby2');
      setUsername(response);
    };
    fetchUsername();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Typography variant="h1" component="h1" align="center">
          Welcome to Unnamed Waste Disposal Company
        </Typography>
        <Typography variant="body1" component="p" align="center">
          We specialize in waste removal and management services.
        </Typography>
        <Typography variant="body1" component="p" align="center">
          Username: {username}
        </Typography>
        <Button variant="contained" color="primary" component={Link} href="/login">
          Go to Login
        </Button>
      </Container>
    </ThemeProvider>
  );
}