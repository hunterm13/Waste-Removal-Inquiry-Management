import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Alert, AlertTitle, CircularProgress, Container, Typography } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { auth } from "../../utils/firebaseConfig";
import { getUserFirstName, getAdminStatus, getReportsByUserId, getUserKpiAllStats } from "../../utils/queries";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";


export default function UserKpi() {
    const router = useRouter();
    const [userName, setUserName] = useState("");
    const { userID } = router.query;
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [newKpiData, setNewKpiData] = useState([
        {"name": "Junk Removal", "Booked": 0, "Follow Up": 0, "Lost": 0},
        {"name": "Fencing", "Booked": 0, "Follow Up": 0, "Lost": 0},
        {"name": "Roll Off", "Booked": 0, "Follow Up": 0, "Lost": 0},
        {"name": "Portable Toilet", "Booked": 0, "Follow Up": 0, "Lost": 0}
    ]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [error, setError] = useState();

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(async user => {
            if (!auth.currentUser) {
                window.location.href = "/login";
            }
            setIsAuthInitialized(true);
            if (user) {
                const adminStatus = await getAdminStatus(user.uid);
                if (!adminStatus) {
                    window.location.href = "/teamReports";
                }
                setIsAdmin(adminStatus);
            }
        });
        return () => unregisterAuthObserver(); 
    }, []);

    useEffect(() => {
        if (isAuthInitialized) {
            const fetchUserKpi = async () => {
                try {
                    const userKpi = await getReportsByUserId(userID);    
                    const userFirstName = await getUserFirstName(userID);
                    setUserName(userFirstName);                
                    formatKpi(userKpi);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching user KPI:", error);
                }
            };
            fetchUserKpi();
        }
    }, [isAuthInitialized]);

    useEffect(() => {
        const fetchUserKpi = async (userID) => {
            try{
                const userKpi = await getReportsByUserId(userID);
                formatKpi(userKpi);
            }
            catch (error) {
                console.error("Error fetching user KPI:", error);
            }
        };
        fetchUserKpi(userID);
    }, [startDate, endDate]);

    const formatKpi = (kpi) => {
        let updatedKpiData = [
            {"name": "Junk Removal", "Booked": 0, "Follow Up": 0, "Lost": 0},
            {"name": "Fencing", "Booked": 0, "Follow Up": 0, "Lost": 0},
            {"name": "Roll Off", "Booked": 0, "Follow Up": 0, "Lost": 0},
            {"name": "Portable Toilet", "Booked": 0, "Follow Up": 0, "Lost": 0}
        ];

        if (startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))) {
            setError("Start date cannot be later than end date");
            setEndDate(null);
            return;
        }

        if (startDate || endDate) {
            // Filter results based on start and end dates
            kpi = kpi.filter(item => {
                const dateReported = dayjs(item.dateReported.toDate()).format("YYYY-MM-DD");
                const start = dayjs(startDate).format("YYYY-MM-DD");
                const end = dayjs(endDate).format("YYYY-MM-DD");
                return dateReported >= start && dateReported <= end;
            });
        }

        kpi.map((item) => {
            let index;
            if (item.service === "Junk Removal") {
                index = 0;
            } else if (item.service === "Fencing") {
                index = 1;
            } else if (item.service === "Roll Off") {
                index = 2;
            } else if (item.service === "Portable Toilet") {
                index = 3;
            }

            if (item.leadTag === "Booked") {
                updatedKpiData[index].Booked++;
            } else if (item.leadTag === "Follow Up") {
                updatedKpiData[index]["Follow Up"]++;
            } else if (item.leadTag === "Lost") {
                updatedKpiData[index].Lost++;
            }
        });

        // Update the state with the new array
        setNewKpiData(updatedKpiData);
    
    };

    if (loading) {
        return <>
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress />
                </Typography>
            </Container>
        </>;
    }

    return <>
        <Container maxWidth="xl" style={{display:"flex", justifyContent:"center"}}>
            <Typography variant="h2" component="h1" align="center">
                {userName}&apos;s KPI Breakdown
            </Typography>
        </Container>
        <Container maxWidth='md'>
            {error &&
                    <Alert severity='error' sx={{ marginBottom: 2 }} onClose={() => setError("")}>
                        <AlertTitle>{error}</AlertTitle>
                    </Alert>
                }
        </Container>
        <Container maxWidth="md" style={{display:"flex", justifyContent:"space-around", marginTop:"3rem"}}>
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker disableFuture value={startDate} maxDate={endDate} onChange={date => setStartDate(date)} /> 
                <DatePicker disableFuture minDate={startDate} value={endDate} onChange={date => setEndDate(date)} />
            </LocalizationProvider>
        </Container>
        <Container maxWidth="md" style={{display:"flex", justifyContent:"space-around", marginBottom:"2rem"}}>
            <Typography variant="h6" component="h2" align="center">
                Start Date
            </Typography>
            <Typography variant="h6" component="h2" align="center">
                End Date
            </Typography>
        </Container>
        <Container maxWidth="xl" style={{display:"flex", justifyContent:"center", border:""}}>
            <BarChart width={730} height={250} data={newKpiData} margin={{right:50}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" /> 
                <YAxis allowDecimals={false} /> 
                <Tooltip />
                <Legend />
                <Bar dataKey="Booked" fill="#38aceb" />
                <Bar dataKey="Follow Up" fill="#bd78e0" />
                <Bar dataKey="Lost" fill="#ff295e" />
            </BarChart>
        </Container>
    </>;
}