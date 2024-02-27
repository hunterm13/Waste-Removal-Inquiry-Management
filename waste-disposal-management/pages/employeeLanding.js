import {useState, useEffect} from 'react';
import  ProtectedRoute  from '../components/ProtectedRoute';
import { Button, CircularProgress, Container, Typography } from '@mui/material';
import { auth } from '../utils/firebaseConfig';
import { getUserFirstName, getDailyConversions, getActiveStatus } from '../utils/queries';
import UserReportsTable from '../components/UserReportsTable';

export default function EmployeeLanding() {
    const [firstName, setFirstName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [dailyConversions, setDailyConversions] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(user => {
            if (isAuthInitialized || !auth.currentUser) {
                window.location.href = '/login';
            }    
            setIsAuthInitialized(true);
            if (user) {
                const fetchUserFirstName = async () => {
                    try {
                        const response = await getUserFirstName(user.uid);
                        const activeStatus = await getActiveStatus(user.uid);
                        setIsActive(activeStatus);
                        setFirstName(response);
                        setLoading(false);
                    } catch (error) {
                        console.error('Error fetching user first name:', error);
                    }
                };
                const fetchDailyConversions = async () => {
                    try {
                        const response = await getDailyConversions(user.uid);
                        setDailyConversions(response);
                    } catch (error) {
                        console.error('Error fetching daily conversions:', error);
                    }
                };
                fetchUserFirstName();
                fetchDailyConversions();
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
    }

    if (!isActive) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    Your account is not active. Please contact an administrator.
                </Typography>
            </Container>
        );
    }

    return (
        <ProtectedRoute>
            <Container maxWidth="xl" style={{marginBottom:'2rem'}}>
                <Typography variant="h2" component="h1" align="center">
                    Welcome to the Employee Dashboard, {firstName}!
                </Typography>
                <Container maxWidth="xl" style={{display:'flex', justifyContent: 'space-between', margin: '2rem 0'}}>
                    <Typography variant="h4" component="h2" align="left">
                        Conversions for today: {dailyConversions}
                    </Typography>
                    <Button variant="contained" color="primary" href="/reporting">New Report</Button>
                </Container>
                <UserReportsTable uid={auth.currentUser.uid} />
            </Container>
        </ProtectedRoute>
    );
};
