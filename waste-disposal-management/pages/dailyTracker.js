import { useState, useEffect } from "react";
import { db } from "../utils/firebaseConfig";
import { collection, query, orderBy, onSnapshot, where } from "firebase/firestore";
import { CircularProgress, Container, Typography, Grid } from "@mui/material";
import { getAllUserID, getAdminStatus, getUserFirstName, getUserLastName } from "../utils/queries";
import DailyUserCard from "../components/DailyUserCard";
import KpiPieChart from "../components/KpiPieChart";
import { Kulim_Park } from "next/font/google";

export default function DailyTracker() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [pieReportData, setPieReportData] = useState({"Junk Removal":0, "Roll Off":0, "Portable Toilet":0, "Fencing":0});

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const q = query(collection(db, "reports"), orderBy("dateReported"), where("dateReported", ">=", today));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            let newReports = [];
            snapshot.forEach((doc) => {
                newReports.push({ id: doc.id, ...doc.data() });
            });
            getUsers(newReports);
        });
        const getUsers = async (newReports) => {
            const response = await getAllUserID();
            const updatedResponse = await Promise.all(response.map(async user => {
                const adminStatus = await getAdminStatus(user);
                if (!adminStatus) {
                    const firstName = await getUserFirstName(user);
                    const lastName = await getUserLastName(user);
                    if(firstName === "Sales" && lastName === "Center"){
                        return;
                    }
                    return [user, `${firstName} ${lastName}`];
                }
            }));
            const filteredReports = (newReports.filter(report => updatedResponse.map(user => user ? user[0] : null).includes(report.userID)));
            setReports(filteredReports);
            setUsers(updatedResponse.filter(user => user !== undefined));
            setPieReportData([
                [filteredReports.filter(report => report.service === "Junk Removal" && report.leadTag === "Booked").length, "Junk Removal"],
                [filteredReports.filter(report => report.service === "Roll Off" && report.leadTag === "Booked").length, "Roll Off"],
                [filteredReports.filter(report => report.service === "Portable Toilet" && report.leadTag === "Booked").length, "Portable Toilet"],
                [filteredReports.filter(report => report.service === "Fencing" && report.leadTag === "Booked").length, "Fencing"],
                [filteredReports.filter(report => report.leadTag === "Lost").length, "Lost"],
                [filteredReports.filter(report => report.leadTag === "Follow Up").length, "Follow Up"],
            ]);
            setLoading(false);
        };

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, []);
    
    

    if (loading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress/>
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl">
            <Container maxWidth="xl" style={{marginTop:"1rem"}}>
                <Grid container spacing={3}>
                    <Grid item xs={8}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h2" component="h1" align="center">
                                    Daily Tracker
                                </Typography>
                                <Typography variant="h5" component="h1" align="center">
                                    For {new Date().toDateString()}
                                </Typography>
                            </Grid>
                            {users.map(user => (
                                <Grid item xs={6} key={user[0]}>
                                    <DailyUserCard userName={user[1]} reports={reports.filter(report => report.userID === user[0])} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="h3" align="center">
                            Today&apos;s  Bookings
                        </Typography>
                        <Typography variant="h4" component="h2" align="center">
                        {reports.filter(report => report.service === "Junk Removal" || report.service === "Portable Toilet" || report.service === "Roll Off" || report.service === "Fencing").length} Reports Today<br></br>{reports.filter(report => report.leadTag === "Booked").length} Bookings
                        </Typography>   
                        <Typography align="center">
                            <KpiPieChart values={pieReportData}/>
                        </Typography>              
                    </Grid>
                </Grid>
            </Container>
        </Container>
    );
}