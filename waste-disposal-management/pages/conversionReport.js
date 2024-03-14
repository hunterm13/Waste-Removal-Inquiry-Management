import { useState, useEffect } from "react";
import { auth } from "../utils/firebaseConfig";
import { getAdminStatus, getAllReports } from "../utils/queries";
import { Container, Typography, CircularProgress } from "@mui/material";

export default function ConversionReport() {
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf("week"));
    const [endDate, setEndDate] = useState(dayjs());
    const [customDate, setCustomDate] = useState(false);
    const [dateRangeType, setDateRangeType] = useState("week");
    const [endDateIsCurrent, setEndDateIsCurrent] = useState(true);

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

    if(loading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress />
                </Typography>
            </Container>
        );
    }

    return <>
    
    </>;
};
