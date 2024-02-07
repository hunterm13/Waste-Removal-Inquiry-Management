'use client';
import React, { useState, useEffect } from 'react';
import { Button, Container,  Typography } from '@mui/material';
import { getUserFirstName } from '../utils/queries';
import Link from 'next/link';

export default function Home() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const response = await getUserFirstName('IQrO6zmQkfQC3gcHdNt8iwmgKby2');
      setUsername(response);
    };
    //fetchUsername();
  }, []);

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
            <Button variant="contained" color="primary" component={Link} href="/employeeLanding">
            Go to Landing
            </Button>
        </Container>
    </Container>
  );
}