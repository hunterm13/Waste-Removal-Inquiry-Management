import {useState, useEffect} from 'react';
import  ProtectedRoute  from '../components/ProtectedRoute';
import { CircularProgress, Container, Typography } from '@mui/material';
import { auth } from '../utils/firebaseConfig';
import { getUserFirstName } from '../utils/queries';
import UserReportsTable from '../components/UserReportsTable';

export default function EmployeeLanding() {
    const [firstName, setFirstName] = useState('');
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(user => {
            if (isAuthInitialized && !auth.currentUser) {
                return <Redirect to="/login" />;
            }    
            setIsAuthInitialized(true);
            if (user) {
                const fetchUserFirstName = async () => {
                    try {
                        const response = await getUserFirstName(user.uid);
                        setFirstName(response);
                        setLoading(false);
                    } catch (error) {
                        console.error('Error fetching user first name:', error);
                    }
                };
                fetchUserFirstName();
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
    return (
        <ProtectedRoute>
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    Welcome to the Employee Dashboard, {firstName}!
                </Typography>
                <UserReportsTable uid={auth.currentUser.uid} />
            </Container>
        </ProtectedRoute>
    );
};
