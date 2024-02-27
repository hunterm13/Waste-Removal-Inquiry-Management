import { Typography, Container, CircularProgress, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { getReportById, getAdminStatus } from '../../utils/queries'
import { auth } from '../../utils/firebaseConfig';
import FrontLoadReport from '../../components/reportViews/FrontLoadReport';
import OtherReport from '../../components/reportViews/OtherReport';
import InsideSaleReport from '../../components/reportViews/InsideSaleReport';

export default function Report() {
    const router = useRouter()
    const { reportID } = router.query
    const [report, setReport] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAuthInitialized, setIsAuthInitialized] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(async user => {
            if (!auth.currentUser) {
                window.location.href = '/login';
            }    
            setIsAuthInitialized(true);
            if (user) {
                const adminStatus = await getAdminStatus(user.uid);
                setIsAdmin(adminStatus);
            }
        });
        return () => unregisterAuthObserver(); 
    }, []);

    useEffect(() => {
        if (reportID && isAuthInitialized) {
            const fetchReport = async () => {
                try {
                    const reportData = await getReportById(reportID)
                    setReport(reportData)
                    setLoading(false)
                } catch (error) {
                    console.error('Error fetching report:', error)
                }
            }
            fetchReport()
        }
    }, [reportID, isAuthInitialized])

    if (!isAuthInitialized || loading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress />
                </Typography>
            </Container>
        );
    }

    if (!report) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    Report not found.
                </Typography>
                <Button variant="contained" color="primary" style={{margin:'2rem auto', display:'block'}} onClick={() => router.push('/employeeLanding')}>Go Back</Button>
            </Container>
        );
    }

    if (report.userID !== auth.currentUser.uid && !isAdmin) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    You are not authorized to view this report.
                </Typography>
                <Button variant="contained" color="primary" style={{margin:'2rem auto', display:'block'}} onClick={() => router.push('/employeeLanding')}>Go Back</Button>
            </Container>
        );
    }

    if(report.service) {
        return <>
            <InsideSaleReport report={report} reportID={reportID} />
        </>
    }

    if (!report.reportType && !report.service) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    Report type not found.
                </Typography>
                <Button variant="contained" color="primary" style={{margin:'2rem auto', display:'block'}} onClick={() => router.push('/employeeLanding')}>Go Back</Button>
            </Container>
        );
    } else if (report.reportType === 'Front Load') {
        return <>
            <FrontLoadReport report={report} reportID={reportID} />
        </>
    } else {
        return <>
            <OtherReport report={report} reportID={reportID} />
        </>
    }
}