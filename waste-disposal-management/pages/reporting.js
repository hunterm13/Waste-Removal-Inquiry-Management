import {useState, useEffect} from 'react';
import  ProtectedRoute  from '../components/ProtectedRoute';
import { Button, CircularProgress, Container, Typography, Select, MenuItem } from '@mui/material';
import { auth } from '../utils/firebaseConfig';
import { getUserFirstName } from '../utils/queries';
import NewReport from '../components/NewReport';

export default function EmployeeLanding() {
    const [userID, setUserID] = useState('11');
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [reportType, setReportType] = useState('insideSale');

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(user => {
            if (!auth.currentUser) {
                window.location.href = '/login';
            }    
            setIsAuthInitialized(true);
            if (user) {
                try {
                    setUserID(user.uid);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching user first name:', error);
                }
            }
        });
        return () => unregisterAuthObserver(); 
    }, []);

    const handleOptionChange = (event) => {
        setReportType(event.target.value);
    }

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
            <Container maxWidth="lg">
                <Container maxWidth='lg' style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0'}}>
                    <Typography variant="h2" component="h1" align="left">
                        New Report
                    </Typography>
                    <Button variant="contained" color="primary" size='large' style={{height:'fit-content'}} href="/employeeLanding">Back</Button>
                </Container>
                <Container maxWidth="lg" style={{display:'flex', padding:'0',  margin: '2rem 0', alignItems: 'center'}}>
                    <Typography variant="h4" component="h2" align="left" style={{marginRight: '1rem'}}>
                        Report Type:
                    </Typography>
                    <Select value={reportType} onChange={handleOptionChange}>
                        <MenuItem value="Front Load">Front Load</MenuItem>
                        <MenuItem value="Swap">Swap</MenuItem>
                        <MenuItem value="Removal">Removal</MenuItem>
                        <MenuItem value="insideSale">Inside Sale</MenuItem>
                        <MenuItem value="Other">Other Inquiry</MenuItem>
                    </Select>
                </Container>
                <NewReport userID={userID} reportType={reportType} />
            </Container>
        </ProtectedRoute>
    );
};
