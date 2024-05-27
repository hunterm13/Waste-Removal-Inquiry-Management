import { useState, useEffect } from "react";
import { auth } from "../utils/firebaseConfig";
import { getFollowUps, getExtendedFollowUps } from "../utils/queries";
import { Container, Typography, CircularProgress, Grid, Button } from "@mui/material";
import FollowUpTable from "../components/FollowUpTable";

export default function Home() {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [olderThan, setOlderThan] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const [noFollowUps, setNoFollowUps] = useState([]);
    const [oneFollowUp, setOneFollowUp] = useState([]);
    const [twoFollowUps, setTwoFollowUps] = useState([]);
    const [extendedFollowUps, setExtendedFollowUps] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(async user => {
            if (!auth.currentUser) {
                window.location.href = "/login";
            } 
            const fetchUserReports = async () => {
                try {
                    setLoading(true);
                    const userReports = await getFollowUps();
                    organizeReports(userReports);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching user reports:", error);
                    setLoading(false);
                }
            };
    
            fetchUserReports();
        });
        return () => unregisterAuthObserver(); 
    }, []);   

    const getOlderReports = async () => {
        if(!extendedFollowUps) {
            try {
                setLoading(true);
                const userReports = await getExtendedFollowUps();
                organizeReports(userReports);
                setLoading(false);
                setExtendedFollowUps(!extendedFollowUps);
            } catch (error) {
                console.error("Error fetching user reports:", error);
                setLoading(false);
            }
        } else {
            try {
                setLoading(true);
                const userReports = await getFollowUps();
                organizeReports(userReports);
                setLoading(false);
                setExtendedFollowUps(!extendedFollowUps);
            } catch (error) {
                console.error("Error fetching user reports:", error);
                setLoading(false);
            }  
        }
    };

    const organizeReports = async (reports) => {
        let noFollowUps = [];
        let oneFollowUps = [];
        let twoFollowUps = [];
        reports.forEach(report => {
            if (report.followUpCount === 0) {
                noFollowUps.push(report);
            } else if (report.followUpCount === 1) {
                oneFollowUps.push(report);
            } else if (report.followUpCount === 2) {
                twoFollowUps.push(report);
            } else {
                noFollowUps.push(report);
            }
        });
        setNoFollowUps(noFollowUps);
        setOneFollowUp(oneFollowUps);
        setTwoFollowUps(twoFollowUps);
    };

    if (loading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress />
                </Typography>
            </Container>
        );
    }
    return <>
        <Container maxWidth="xl">
            <Typography variant="h2" component="h1" align="center">
                Outstanding Follow Ups
            </Typography>
            <Container maxWidth="xl" style={{margin:"2rem 0"}}>
                <Container maxWidth="xl" style={{padding:"0", margin:"0", display:"flex", justifyContent:"space-between"}}>
                    <Typography variant="h4" component="h2">
                        No Follow Ups
                    </Typography>
                    <Button onClick={getOlderReports} style={{margin:"0"}} variant="contained" color="primary">{extendedFollowUps ? "Show only 14 Days" : "Extend to 30 Days"}</Button>
                </Container>
                <FollowUpTable reports={noFollowUps}/>
            </Container>
            <Container maxWidth="xl" style={{margin:"2rem 0"}}>
                <Typography variant="h4" component="h2">
                    One Follow Up
                </Typography>
                <FollowUpTable reports={oneFollowUp}/>
            </Container>
            <Container maxWidth="xl" style={{margin:"2rem 0"}}>
                <Typography variant="h4" component="h2">
                    Two Follow Ups
                </Typography>
                <FollowUpTable reports={twoFollowUps}/>
            </Container>
        </Container>
    </>;
}