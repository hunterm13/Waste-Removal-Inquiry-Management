import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Typography, CircularProgress } from '@mui/material';
import { auth } from '../utils/firebaseConfig';
import  ProtectedRoute  from '../components/ProtectedRoute';
import { fetchReports, getAdminStatus } from '../utils/queries';
import KpiBar from '../components/KpiSingleBar';
import KpiPieChart from '../components/KpiPieChart';
import AllUserKpiTable from '../components/AllUserKpiTable';

export default function TeamReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [totalSales, setTotalSales] = useState(0);
    const [totalInquiries, setTotalInquiries] = useState(0);

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(async user => {
            if (!auth.currentUser) {
                window.location.href = '/login';
            }    
            setIsAuthInitialized(true);
            if (user) {
                const adminStatus = await getAdminStatus(user.uid);
                setIsAdmin(adminStatus);
                setLoading(false);
            }
        });
        return () => unregisterAuthObserver(); 
    }, []);

    if (!isAuthInitialized || loading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress />
                </Typography>
            </Container>
        );
    } else if (isAdmin) {
        return (
            <ProtectedRoute>
                <Container maxWidth='xl'>
                    <Container maxWidth="xl" style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <Typography variant="h2" component="h1" align="left">Conversions</Typography>
                        <Typography variant="h2" component="h1" align="right">Follow Ups</Typography>
                    </Container>
                    <Container maxWidth="xl" style={{ display: 'flex', justifyContent: 'space-around'}}>
                        <KpiPieChart values={[[50,'Swap'], [100,'Front Load'], [33,'Roll Off'],[51, 'Portable Toilet']]} />
                        <KpiPieChart values={[[50,'Swap'], [100,'Front Load'], [33,'Roll Off'],[51, 'Portable Toilet']]} totalInquiries={400} />
                    </Container>
                    <AllUserKpiTable />
                </Container>
            </ProtectedRoute>
        );
    } else {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    You are not authorized to view this page.
                </Typography>
                <Typography variant="h5" component="h1" align="center">
                    If you believe this is an error, please contact your system administrator.
                </Typography>
            </Container>
        );        
    }
};