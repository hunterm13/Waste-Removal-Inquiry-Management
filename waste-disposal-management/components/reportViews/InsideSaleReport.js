import { Container, Typography, Button, Select, TextField, MenuItem, FormControl, InputLabel, RadioGroup, FormLabel, FormControlLabel, Radio, Alert, AlertTitle } from "@mui/material";
import { useEffect, useState } from "react";
import { deleteReportById, updateReportById, updateReportsWithUserName, updateFollowUp } from "../../utils/queries";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Router, useRouter } from "next/router";
import dayjs from "dayjs";

export default function FrontLoadReport({report, reportID}) {
    const [reportData, setReportData] = useState(report);
    const [initialReportData, setInitialReportData] = useState(report);
    const [editing, setEditing] = useState(false);
    const [isFormDirty, setFormDirty] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formattedDateUpdated, setFormattedDateUpdated] = useState();
    const [error, setError] = useState("");
    const router = useRouter();


    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (isFormDirty && !isSubmitting) {
            event.preventDefault();
            event.returnValue = "";
            }
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isFormDirty, isSubmitting]);

    const formatDateLocale = (date) => {
        const dateMilliseconds = date.seconds * 1000 + date.nanoseconds / 1000000;
        const formattedDate = new Date(dateMilliseconds);
        return formattedDate.toLocaleString();
    };
    const formattedDateReported = formatDateLocale(reportData.dateReported);

    const updateTime = () => {
        if (reportData.dateUpdated) {
            setFormattedDateUpdated(formatDateLocale(reportData.dateUpdated));
        }
    };
    useEffect(() => {       
        updateTime();
    }, [reportData]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete the report? This action cannot be undone.");
        if (confirmDelete) {
            try{
                await deleteReportById(reportID);
                window.location.href = "/employeeLanding";
            } catch (error) {
                console.error("Error deleting report:", error);
            }            
        }
    };

    const handleInputChange = (event, field) => {
        setReportData(prevReport => {
            if(field === "deliveryDate" || field === "removalDate"){
                return { ...prevReport, [field]: convertToDate(event) };
            } else {
                return { ...prevReport, [field]: event.target.value };
            }
        });
        setFormDirty(true);
    };
    
    useEffect(() => {
        if (reportData.service === "Roll Off") {
            setReportData({ ...reportData, workFlow: "DELIVERRO" });
        } else if (reportData.service === "Junk Removal") {
            setReportData({ ...reportData, workFlow: "SERVICEJR" });
        } else if (reportData.service === "Portable Toilet") {
            setReportData({ ...reportData, workFlow: "DELPT" });
        } else if (reportData.service === "Fencing") {
            setReportData({ ...reportData, workFlow: "DELFE" });
        }
    }, [reportData.service]);

    const handleCancel = () => {
        if(isFormDirty){
            const confirmCancel = window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.");
            if (confirmCancel) {
                setReportData(initialReportData);
                setEditing(false);
                setFormDirty(false);
                setError("");
            }
        } else {
            setEditing(false);
            setReportData(initialReportData);
            setError("");
        }
    };

    const followingUp = async () => {
        const confirmFollowUp = window.confirm("Have you followed up with this lead?");
        if (confirmFollowUp) {
            const followUpCount = reportData.followUpCount ? reportData.followUpCount + 1 : 1;
            updateFollowUp(reportID, reportData, followUpCount);
        }
    };


    function convertToDateObject(dateString) {
        const [month, day, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day); // Note: Months are zero-indexed (January is 0)
    }

    const handleEdit = async () => {
        try {
            if (editing && isFormDirty) {
                const confirmSave = window.confirm("Are you sure you want to save changes?");
                if (confirmSave) {
                    if(reportData.deliveryDate){
                        setReportData({ ...reportData, deliveryDate: convertToDate(reportData.deliveryDate) });
                    }
                    if(reportData.removalDate) {
                        setReportData({ ...reportData, removalDate: convertToDate(reportData.removalDate) });
                        if (convertToDateObject(reportData.deliveryDate) > convertToDateObject(reportData.removalDate)) {
                            setError("Removal date cannot be before delivery date");
                            return;
                        }
                    }
                    await updateReportById(reportID, reportData);
                    setEditing(false);
                    setFormDirty(false);
                    setInitialReportData(reportData);
                    setError("");
                }
            } else if (editing && !isFormDirty){
                setEditing(false);
            } else {
                setEditing(true);
            }
        } catch (error) {
            console.log(error);
            setError(`${error.message}`);
        }
    };

    const convertToDate = (date) => {
        let newDate = new Date(date);
        let day = newDate.getDate(); // Day of the month, from 1-31
        let month = newDate.getMonth() + 1; // Months are zero-based, so we add 1
        let year = newDate.getFullYear();
        let formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    };

    return <>
        <Container maxWidth="lg">
            <Container maxWidth='lg' style={{padding:"0", display:"flex", justifyContent: "space-between" }}>
                <Typography variant="h2" style={{marginBottom:"2rem"}} component="h1">{report.service} Report Details</Typography>
                <Button variant="contained" style={{height:"fit-content"}} onClick={handleDelete} color="alert">Delete Report</Button>
            </Container>
            {error && 
                <Alert severity='error' sx={{ marginBottom: 2 }}>
                    <AlertTitle>{error}</AlertTitle>
                </Alert>}
            {editing && reportData? <form>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", padding: "0" }}>
                    <FormControl sx={{width:"20%"}}>
                        <InputLabel id="service">Service *</InputLabel>
                        <Select 
                            required 
                            onChange={(event) => handleInputChange(event, "service")}
                            label={"Service"}
                            labelId="service"
                            value={reportData.service}
                        >
                            <MenuItem value="Roll Off">Roll Off</MenuItem>
                            <MenuItem value="Junk Removal">Junk Removal</MenuItem>
                            <MenuItem value="Portable Toilet">Portable Toilet</MenuItem>
                            <MenuItem value="Fencing">Fencing</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl  sx={{width:"20%"}}>
                        <InputLabel id="workFlow">{reportData.workFlow || "Work Flow"}</InputLabel>
                        <Select
                            label={"Work Flow"}
                            labelId="workFlow"
                            value={reportData.workFlow}
                            disabled
                        >
                            <MenuItem value="DELIVERRO">DELIVERRO</MenuItem>
                            <MenuItem value="SERVICEJR">SERVICE-JR</MenuItem>
                            <MenuItem value="DELPT">DELPT</MenuItem>
                            <MenuItem value="DELFE">DELFE</MenuItem>
                        </Select>
                    </FormControl>
                    {reportData.service === "Roll Off" ? <FormControl style={{display:"flex", flexWrap:"nowrap", flexDirection:"row", alignItems:"center", gap:"1rem"}} sx={{width:"50%"}}>
                        <FormLabel id="binSize">Bin Size (Yards):</FormLabel>
                        <RadioGroup
                            label={"Bin Size (Yards)"}
                            labelId="binSize"
                            value={reportData.binSize}
                            style={{ display: "flex", flexDirection: "row" }}
                            onChange={(event) => handleInputChange(event, "binSize")}
                        >
                            <FormControlLabel value="10" control={<Radio/>} label="10" />
                            <FormControlLabel value="15" control={<Radio/>} label="15" />
                            <FormControlLabel value="30" control={<Radio/>} label="30" />
                            <FormControlLabel value="40" control={<Radio/>} label="40" />
                        </RadioGroup>
                    </FormControl>: null}
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding: "0" }}>
                    
                    <FormControl  sx={{width:"25%"}}>
                        <InputLabel id="region">Region *</InputLabel>
                        <Select 
                            required
                            id="region"
                            value={reportData.region}
                            onChange={(event) => handleInputChange(event, "region")}
                            label={"Region"}
                            labelId="region"                            
                        >
                            <MenuItem value="Edmonton">Edmonton</MenuItem>
                            <MenuItem value="Calgary">Calgary</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl  sx={{width:"40%"}}>
                        <TextField
                            
                            label="Address"
                            value={reportData.siteAddress}
                            onChange={(event) => handleInputChange(event, "siteAddress")}
                        />
                    </FormControl>
                    <FormControl  sx={{width:"25%"}}>
                        <TextField
                            label="City"
                            value={reportData.city}
                            onChange={(event) => handleInputChange(event, "city")}
                        />
                    </FormControl>                    
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding:"0" }}>
                    <FormControl  sx={{width:"30%"}}>
                        <TextField
                            
                            helperText="If not available, enter 'NA'"
                            label="Contact Number"
                            value={reportData.siteNumber}
                            onChange={(event) => handleInputChange(event, "siteNumber")}
                        />
                    </FormControl>
                    <FormControl  sx={{width:"30%"}}>
                        <TextField
                            label="Contact Name"
                            value={reportData.contactName}
                            onChange={(event) => handleInputChange(event, "contactName")}
                        />
                    </FormControl>
                    <FormControl  sx={{width:"30%"}}>
                        <TextField
                            
                            label="Contact Email"
                            value={reportData.contactEmail}
                            onChange={(event) => handleInputChange(event, "contactEmail")}
                        />
                    </FormControl>
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding:"0"}}>
                    <FormControl  sx={{width:"30%"}}>
                        <TextField
                            
                            label="Business Name"
                            value={reportData.siteName}
                            onChange={(event) => handleInputChange(event, "siteName")}
                        />
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Delivery Date"
                            format="MM/DD/YYYY"
                            onChange={(date) => handleInputChange(date, "deliveryDate")}
                            value={reportData.deliveryDate ? dayjs(reportData.deliveryDate) : null}
                        />                        
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Removal Date"
                            format="MM/DD/YYYY"
                            value={reportData.removalDate ? dayjs(reportData.removalDate) : null}
                            onChange={(date) => handleInputChange(date, "removalDate")}
                        />
                    </LocalizationProvider>
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding:"0" }}>
                    <FormControl component="fieldset" sx={{ width: "30%" }}>
                        <FormLabel component="legend">Lead Channel</FormLabel>
                        <RadioGroup
                            
                            aria-label="Lead Channel"
                            name="leadChannel"
                            value={reportData.leadChannel}
                            onChange={(event) => handleInputChange(event, "leadChannel")}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <FormControlLabel value="Phone" control={<Radio/>} label="Phone" />
                            <FormControlLabel value="CMS" control={<Radio/>} label="CMS" />
                            <FormControlLabel value="Podium" control={<Radio/>} label="Podium" />
                        </RadioGroup>
                    </FormControl>
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding:"0" }}>
                    <FormControl sx={{ width: "30%" }}>
                        <FormLabel component="legend">Lead Tag</FormLabel>
                        <RadioGroup
                            aria-label="Lead Tags"
                            name="leadTags"
                            value={reportData.leadTag}
                            onChange={(event) => handleInputChange(event, "leadTag")}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <FormControlLabel value="Follow Up" control={<Radio/>} label="Follow Up" />
                            <FormControlLabel value="Booked" control={<Radio/>} label="Booked" />
                            <FormControlLabel value="Lost" control={<Radio/>} label="Lost" />
                        </RadioGroup>
                    </FormControl>
                    {reportData.leadTag === "Lost" && (
                        <FormControl sx={{ width: "30%" }}>
                            <InputLabel id="reason-lost">Reason Lost</InputLabel>
                            <Select
                                label="Reason Lost"
                                value={reportData.reasonLost}
                                onChange={(event) => handleInputChange(event, "reasonLost")}
                            >
                                <MenuItem value="Price">Price</MenuItem>
                                <MenuItem value="Competition">Competition</MenuItem>
                                <MenuItem value="No Response">No Response</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    {reportData.reasonLost === "Other" && reportData.leadTag === "Lost" && (
                        <FormControl sx={{ width: "30%" }}>
                            <TextField
                                
                                label="Other Reason Lost"
                                value={reportData.otherReasonLost}
                                onChange={(event) => handleInputChange(event, "otherReasonLost")}
                            />
                        </FormControl>
                    )}
                </Container>
                <Container maxWidth="lg" style={{padding:"0", marginTop:"1rem"}}>
                    <FormControl sx={{ width: "100%" }}>
                        <TextField
                            
                            multiline
                            label="Notes"
                            value={reportData.notes}
                            onChange={(event) => handleInputChange(event, "notes")}
                        />
                    </FormControl>
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding: "0" }}>
                    <FormControl sx={{ width: "25%" }}>
                        <InputLabel id="how-hear-label">How did they hear about us?</InputLabel>
                        <Select
                            labelId="how-hear-label"
                            id="how-hear-select"
                            label="How did they hear about us?"
                            
                            value={reportData.howHear}
                            onChange={(event) => handleInputChange(event, "howHear")}
                        >
                            <MenuItem value="Kijiji">Kijiji</MenuItem>
                            <MenuItem value="Facebook">Facebook</MenuItem>
                            <MenuItem value="Word of Mouth">Word of Mouth</MenuItem>
                            <MenuItem value="Google">Google</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    {reportData.howHear === "other" && (
                    <FormControl sx={{ width: "40%" }}>
                        <TextField
                        
                        label="Other"
                        value={reportData.otherHowHear}
                        onChange={(event) => handleInputChange(event, "otherHowHear")}
                        />
                    </FormControl>
                    )} 
                </Container>
            </form> : 
            <Container style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
                <Typography variant="body1" component="h2">Service: {reportData.service}</Typography>
                {reportData.binSize ? <Typography variant="body1" component="h2">Bin Size: {reportData.binSize}</Typography> : null}
                <Typography variant="body1" component="h2">Region: {reportData.region}</Typography>
                <Typography variant="body1" component="h2">Location: {reportData.city}, {reportData.siteAddress}</Typography>
                <Typography variant="body1" component="h2">Contact Phone: {reportData.siteNumber}</Typography>
                <Typography variant="body1" component="h2">Contact Name: {reportData.contactName}</Typography>
                <Typography variant="body1" component="h2">Contact Email: {reportData.contactEmail}</Typography>
                <Typography variant="body1" component="h2">Business Name: {reportData.siteName}</Typography>
                {reportData.howHear !== "Other" ? <Typography variant="body1" component="h2">How did they hear about us? {reportData.howHear}</Typography> : <Typography variant="body1" component="h2">How did you hear about us? {reportData.otherHear}</Typography>}
                <Typography variant="body1" component="h2">Lead Channel: {reportData.leadChannel}</Typography>
                <Typography variant="body1" component="h2">Lead Tag: {reportData.leadTag}</Typography>
                {reportData.leadTag === "Follow Up" ? <Button style={{width:"fit-content"}} onClick={followingUp} variant="contained">Followed Up With</Button> : null}
                {reportData.leadTag === "Follow Up" ? 
                    <>
                        <Typography variant="body1" component="h2">Times Followed Up: {reportData.followUpCount ? reportData.followUpCount : "0"}</Typography>
                        <Typography variant="body1" component="h2">Last Follow Up Date: {reportData.followUpDate ? formatDateLocale(reportData.followUpDate) : "N/A"}</Typography>
                    </> : null
                }
                {reportData.leadTag === "Lost" && reportData.reasonLost !== "Other" ? <Typography variant="body1" component="h2">Reason Lost: {reportData.reasonLost}</Typography> : null}
                {reportData.leadTag === "Lost" && reportData.reasonLost === "Other" ? <Typography variant="body1" component="h2">Reason Lost: {reportData.otherReasonLost}</Typography> : null}
                {reportData.deliveryDate ? <Typography variant="body1" component="h2">Delivery Date: {reportData.deliveryDate}</Typography> : null}
                {reportData.removalDate ? <Typography variant="body1" component="h2">Removal Date: {reportData.removalDate}</Typography> : null}
                <Typography variant="body1" component="h2">Notes: {reportData.notes}</Typography>
            </Container>
            }
            <Container style={{display:"flex", padding:"0", justifyContent:"space-between", marginTop:"1rem"}}>
                <Button variant="contained" onClick={() => (router.back())}>Back</Button>
                <Container style={{margin:"0", width:"fit-content", display:"flex", gap:"1rem"}}>
                    {editing && <Button variant="contained" color="secondary" onClick={handleCancel}>Cancel</Button>}
                    <Button variant="contained" onClick={handleEdit}>{editing ? "Save" : "Edit"}</Button>                    
                </Container>
            </Container>
            <Typography variant="body1" style={{marginTop:"1rem"}} component="h2">Date Reported: {formattedDateReported}</Typography>
            {reportData.dateUpdated ? <Typography variant="body1" component="h2">Date Last Updated: {formattedDateUpdated}</Typography> : null}
            <Typography variant="body1" component="h2">Report ID: {reportID}</Typography>
            <Typography variant="body1" component="h2">Reported By: {reportData.userName}</Typography>
        </Container>
    </>;
}