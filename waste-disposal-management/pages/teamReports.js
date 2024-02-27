import React, { useEffect, useState } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import { auth } from "../utils/firebaseConfig";
import  ProtectedRoute  from "../components/ProtectedRoute";
import { getAdminStatus, getAllReports } from "../utils/queries";
import KpiBar from "../components/KpiSingleBar";
import KpiPieChart from "../components/KpiPieChart";
import AllUserKpiTable from "../components/AllUserKpiTable";

export default function TeamReports() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [booked, setBooked] = useState({
        junkRemoval: 0,
        fencing: 0,
        rollOff: 0,
        portableToilet: 0
    });
    const [followUp, setFollowUp] = useState({
        junkRemoval: 0,
        fencing: 0,
        rollOff: 0,
        portableToilet: 0
    });
    const [otherReports, setOtherReports] = useState(0);

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(async user => {
            if (!auth.currentUser) {
                window.location.href = "/login";
            }    
            setIsAuthInitialized(true);
            if (user) {
                
                const adminStatus = await getAdminStatus(user.uid);
                setIsAdmin(adminStatus);
                if (adminStatus) {
                    const fetchData = async () => {
                        const response = await getAllReports();
                        setReports(response);
                        calculateSales(response);
                        setLoading(false);
                    };

                    fetchData();
                }
            }
        });
        return () => unregisterAuthObserver(); 
    }, []);

    const calculateSales = (reports) => {
        console.log(reports);
        let bookedCount = {
            junkRemoval: 0,
            fencing: 0,
            rollOff: 0,
            portableToilet: 0
        };
        let followUpCount = {
            junkRemoval: 0,
            fencing: 0,
            rollOff: 0,
            portableToilet: 0
        };
        let lostCount = 0;

        reports.forEach(report => {
            if (report.leadTag === "Booked") {
                if (report.service === "Junk Removal") {
                    bookedCount.junkRemoval++;
                } else if (report.service === "Fencing") {
                    bookedCount.fencing++;
                } else if (report.service === "Roll Off") {
                    bookedCount.rollOff++;
                } else if (report.service === "Portable Toilet") {
                    bookedCount.portableToilet++;
                }
            } else if (report.leadTag === "Follow Up") {
                if (report.service === "Junk Removal") {
                    followUpCount.junkRemoval++;
                } else if (report.service === "Fencing") {
                    followUpCount.fencing++;
                } else if (report.service === "Roll Off") {
                    followUpCount.rollOff++;
                } else if (report.service === "Portable Toilet") {
                    followUpCount.portableToilet++;
                }
            } else {
                lostCount++;
            }
        });
        console.log(bookedCount, followUpCount, lostCount);


        setBooked(bookedCount);
        setFollowUp(followUpCount);
        setOtherReports(lostCount);
        console.log(`other reports: ${otherReports}`);
    };

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
                    <Container maxWidth="xl" style={{ display: "flex", justifyContent: "space-around" }}>
                        <Typography variant="h2" component="h1" align="left">Bookings</Typography>
                        <Typography variant="h2" component="h1" align="right">Follow Ups</Typography>
                    </Container>
                    <Container maxWidth="xl" style={{ display: "flex", justifyContent: "space-around"}}>
                        <KpiPieChart values={[[booked.junkRemoval,"Junk Removal"], [booked.fencing,"Fencing"], [booked.rollOff,"Roll Off"],[booked.portableToilet, "Portable Toilet"]]} />
                        <KpiPieChart values={[[followUp.junkRemoval,"Junk Removal"], [followUp.fencing,"Fencing"], [followUp.rollOff,"Roll Off"],[followUp.portableToilet, "Portable Toilet"]]} totalInquiries={otherReports} />
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