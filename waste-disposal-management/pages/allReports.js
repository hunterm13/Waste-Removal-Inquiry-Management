import { useState, useEffect } from "react";
import { auth } from "../utils/firebaseConfig";
import { getAdminStatus,  } from "../utils/queries";
import { Container, Typography, CircularProgress } from "@mui/material";
import AllReportsTable from "../components/AllReportsTable";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(async user => {
            if (!auth.currentUser) {
                window.location.href = "/login";
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

    if (loading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress />
                </Typography>
            </Container>
        );
    }

    if (!isAdmin) {
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
    } else {
        return <>
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    All Reports
                </Typography>
                <AllReportsTable />
            </Container>
        </>;
    }
}