import React, { use, useEffect, useState } from "react";
import { Container, Typography, CircularProgress, Button } from "@mui/material";
import { auth } from "../utils/firebaseConfig";
import  ProtectedRoute  from "../components/ProtectedRoute";
import { getAdminStatus, getAllReports } from "../utils/queries";
import AllUserKpiTable from "../components/AllUserKpiTable";
import KpiReportGenerator from "../components/KpiReportGenerator";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

export default function TeamReports() {
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

    useEffect(() => {
        const currentDate = dayjs();
        if (endDate.isAfter(currentDate) || endDate.isSame(currentDate, "day")) {
            if (!endDateIsCurrent) {
                setEndDate(currentDate);
                setEndDateIsCurrent(true);
            }
        } else {
            if (endDateIsCurrent) {
                setEndDateIsCurrent(false);
            }
        }
    }, [endDate]);

    const dateBack = () => {
        if (dateRangeType === "Week") {
            setStartDate(startDate.subtract(1, "week"));
            const newEndDate = startDate.subtract(1, "week").endOf("week");
            setEndDate(newEndDate.isAfter(dayjs()) ? dayjs() : newEndDate);
        } else if (dateRangeType === "Month") {
            setStartDate(startDate.subtract(1, "month"));
            const newEndDate = startDate.subtract(1, "month").endOf("month");
            setEndDate(newEndDate.isAfter(dayjs()) ? dayjs() : newEndDate);
        } else if (dateRangeType === "Year") {
            setStartDate(startDate.subtract(1, "year"));
            const newEndDate = startDate.subtract(1, "year").endOf("year");
            setEndDate(newEndDate.isAfter(dayjs()) ? dayjs() : newEndDate);
        } else if (dateRangeType === "Day") {
            setStartDate(startDate.subtract(1, "day"));
            const newEndDate = startDate.subtract(1, "day").endOf("day");
            setEndDate(newEndDate.isAfter(dayjs()) ? dayjs() : newEndDate);
        }
    };

    const dateForward = () => {
        if (dateRangeType === "Week") {
            const newStartDate = startDate.add(1, "week");
            const newEndDate = endDate.add(1, "week");
            setStartDate(newStartDate);
            setEndDate(newEndDate.isAfter(dayjs()) ? dayjs() : newEndDate);
        } else if (dateRangeType === "Month") {
            const newStartDate = startDate.add(1, "month");
            const newEndDate = endDate.add(1, "month");
            setStartDate(newStartDate);
            setEndDate(newEndDate.isAfter(dayjs()) ? dayjs() : newEndDate);
        } else if (dateRangeType === "Year") {
            const newStartDate = startDate.add(1, "year");
            const newEndDate = endDate.add(1, "year");
            setStartDate(newStartDate);
            setEndDate(newEndDate.isAfter(dayjs()) ? dayjs() : newEndDate);
        } else if (dateRangeType === "Day") {
            const newStartDate = startDate.add(1, "day");
            const newEndDate = endDate.add(1, "day");
            setStartDate(newStartDate);
            setEndDate(newEndDate.isAfter(dayjs()) ? dayjs() : newEndDate);
        }
    };

    const ytd = () => {
        setStartDate(dayjs().startOf("year"));
        setEndDate(dayjs());
        setDateRangeType("Year");
        setCustomDate(false);
    };

    const mtd = () => {
        setStartDate(dayjs().startOf("month"));
        setEndDate(dayjs());
        setDateRangeType("Month");
        setCustomDate(false);
    };

    const wtd = () => {
        setStartDate(dayjs().startOf("week"));
        setEndDate(dayjs());
        setDateRangeType("Week");
        setCustomDate(false);
    };

    const dtd = () => {
        setStartDate(dayjs().startOf("day"));
        setEndDate(dayjs());
        setDateRangeType("Day");
        setCustomDate(false);
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
                        <KpiReportGenerator startDate={startDate} endDate={endDate}/>
                    </Container>
                    <Container maxWidth="md" style={{display:"flex", justifyContent:"space-around"}}>
                        <Button variant="contained" onClick={dateBack}><KeyboardArrowLeftIcon />{dateRangeType}</Button>
                        <Typography variant="h6" component="h2" align="center">
                            Showing data from {startDate.format("MM/DD/YYYY")} to {endDate.format("MM/DD/YYYY")}
                        </Typography>
                        <Button variant="contained" disabled={endDateIsCurrent}  onClick={dateForward}><KeyboardArrowRightIcon />{dateRangeType}</Button>
                    </Container>
                    <Container maxWidth="sm" style={{display:"flex", justifyContent:"space-around", marginTop:"1rem"}}>
                        <Button variant="contained" onClick={ytd}>By Year</Button>
                        <Button variant="contained" onClick={mtd}>BY Month</Button>                        
                        <Button variant="contained" onClick={wtd}>By Week</Button>
                        <Button variant="contained" onClick={dtd}>By Day</Button>
                    </Container>
                    {!customDate ? <Container maxWidth="sm" style={{display:"flex", justifyContent:"space-around", marginTop:"1rem", marginBottom:"5rem"}}>
                        <Button variant="contained" onClick={() => setCustomDate(true)}>Custom Date Range</Button>
                    </Container> : null }
                    {customDate ? <><Container maxWidth="sm" style={{display:"flex", justifyContent:"space-around", marginTop:"1rem"}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker disableFuture value={startDate} maxDate={endDate} onChange={date => setStartDate(date)} /> 
                            <DatePicker disableFuture value={endDate} minDate={startDate} onChange={date => setEndDate(date)} />
                        </LocalizationProvider>
                    </Container>                    
                    <Container maxWidth="sm" style={{display:"flex", justifyContent:"space-around", marginBottom:"2rem"}}>
                        <Typography variant="h6" component="h2" align="center">
                            Start Date
                        </Typography>
                        <Typography variant="h6" component="h2" align="center">
                            End Date
                        </Typography>
                    </Container>    </>: null}                 
                    <AllUserKpiTable startDate={startDate} endDate={endDate}/>
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