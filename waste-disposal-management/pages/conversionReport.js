import { useState, useEffect } from "react";
import { auth } from "../utils/firebaseConfig";
import { getAdminStatus, getAllReports } from "../utils/queries";
import { AlertTitle, FormControl, Container, InputLabel, Typography, CircularProgress, Select, MenuItem, Button, Alert } from "@mui/material";
import FileDropzone from "../components/FileDropzone";
import ConversionReportGenerator from "../components/ConversionReportGenerator";
import { styled } from "@mui/system";
import AccuracyReportGenerator from "../components/AccuracyReportGenerator";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const FadeAlert = styled(Alert)(({ theme }) => ({
    opacity: 0,
    marginBottom: "1rem",
    transition: "opacity 0.1s ease-in-out",
    "&.show": {
      opacity: 1,
    },
  }));

export default function ConversionReport() {
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [creatingAccuracyReport, setCreatingAccuracyReport] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [formUploadingType, setformUploadingType] = useState("Please Select a Report Type");
    const [success, setSuccess] = useState(false);
    const [creatingConversionReport, setCreatingConversionReport] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf("week"));
    const [endDate, setEndDate] = useState(dayjs());
    const [customDate, setCustomDate] = useState(false);
    const [dateRangeType, setDateRangeType] = useState("Week");
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
        if(success) {
            setTimeout(() => {
                setSuccess(false);
            }, 5000);
        }
    }, [success]);

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

    if(loading) {
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
            {success && (
                <Container maxWidth="xl">
                    <Alert severity="success" onClose={() => setSuccess(false)}>
                        <AlertTitle>Upload Success</AlertTitle>
                    </Alert>
                </Container>
            )}
            <Container maxWidth="md">
                <Typography variant="h2" component="h1" align="center" style={{marginBottom:"2rem"}}>
                    Reporting Tools
                </Typography>
                
                {!uploadingFile && !creatingAccuracyReport && !creatingConversionReport && (
                <Container maxWidth="sm" style={{display:"flex", justifyContent: "space-around", marginTop:"3rem"}}>
                    <Button variant="contained" onClick={() => setUploadingFile(true)}>Upload File</Button>
                    <Button variant="contained" onClick={() => setCreatingConversionReport(true)}>View Conversion</Button>
                    <Button variant="contained" onClick={() => setCreatingAccuracyReport(true)}>View Accuracy</Button>
                </Container>
                )}
            </Container>
            {uploadingFile && (
                <Container maxWidth="lg" style={{display:"flex", flexDirection:"column", justifyContent:"space-between"}}>
                    <Container style={{display:"flex", justifyContent:"space-between", alignItems: "center", marginBottom:"2rem", padding:"0"}}>
                        <FormControl sx={{width:"fit-content", minWidth:"13%"}}>
                            <InputLabel id="report-type">Report Type</InputLabel>
                            <Select
                                label={"Report Type"}
                                labelId="report-type"
                                value={formUploadingType}
                                onChange={(e) => setformUploadingType(e.target.value)}
                            >
                                <MenuItem value="Please Select a Report Type" disabled>Please Select a Report Type</MenuItem>
                                <MenuItem value="telus">Telus</MenuItem>
                                <MenuItem value="podium">Podium</MenuItem>
                                <MenuItem value="tower">Tower</MenuItem>
                                <MenuItem value="cms">CMS</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" style={{height:"fit-content"}}color="secondary" onClick={() => {setUploadingFile(false);}}>Cancel</Button>
                    </Container>
                    {formUploadingType !== "Please Select a Report Type" && <FileDropzone formType={formUploadingType} setSuccess={setSuccess} setUploadingFile={setUploadingFile}/>}
                </Container>
            )}
            {creatingAccuracyReport && (
                <Container maxWidth="xl">
                    <AccuracyReportGenerator startDate={startDate} endDate={endDate} />
                    <Container>
                        <Button variant="contained" color="secondary" onClick={() => {
                            setUploadingFile(false);
                            setCreatingAccuracyReport(false);
                        }}>Cancel</Button>
                    </Container>
                </Container>
            )}
            {creatingConversionReport && (
                <Container maxWidth="xl">
                    <ConversionReportGenerator startDate={startDate} endDate={endDate}/>
                    <Container>
                        <Button variant="contained" color="secondary" onClick={() => {
                            setUploadingFile(false);
                            setCreatingConversionReport(false);
                        }}>Cancel</Button>
                    </Container>
                </Container>
            )}
            {creatingAccuracyReport || creatingConversionReport ? 
            <>
            <Container maxWidth="md" style={{display:"flex", justifyContent:"space-around"}}>
                            <Button variant="contained" onClick={dateBack}><KeyboardArrowLeftIcon />{dateRangeType}</Button>
                            <Typography variant="h6" component="h2" align="center">
                                Showing data from {startDate.format("MM/DD/YYYY")} to {endDate.format("MM/DD/YYYY")}
                            </Typography>
                            <Button variant="contained" disabled={endDateIsCurrent}  onClick={dateForward}>{dateRangeType}<KeyboardArrowRightIcon /></Button>
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
                        </Container>    </>: null}</> : null}
        </>;
    }
};
