import React from 'react';
import { Box, LinearProgress, Container, Typography } from '@mui/material';

const KpiSingleBar = ({ salesMade, totalInquiries}) => {
    const progress = (salesMade / totalInquiries) * 100;

    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgress variant="determinate" value={progress} />
            <Container maxWidth="lg" sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography variant="h6">
                    {salesMade} Conversions
                </Typography>
                <Typography variant="h6">
                    {totalInquiries} Inquiries
                </Typography>
            </Container>
        </Box>
    );
};

export default KpiSingleBar;
