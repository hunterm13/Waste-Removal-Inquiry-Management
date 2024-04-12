import { Box, Menu, Select, TextField, MenuItem, FormControl, InputLabel, Container, RadioGroup, Button, FormLabel, FormControlLabel, Radio, Typography, Alert, AlertTitle } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import { newReport } from "../utils/queries";

export default function NewReport({ userID, reportType }) {
    const [report, setReport] = useState({});
    const [error, setError] = useState("");
    const [isFormDirty, setFormDirty] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
    
    const handleInputChange = (event, field) => {
        setReport(prevReport => {
            if(field === "deliveryDate" || field === "removalDate"){
                return { ...prevReport, [field]: convertToDate(event) };
            } else {
                return { ...prevReport, [field]: event.target.value };
            }
        });
        setFormDirty(true);
    };

    useEffect(() => {
        if (reportType === "insideSale") {
            setReport({
                service: "rollOff",
                workFlow: "",
                region: "",
                city: "",
                siteName: "",
                contactName: "", // can be blank
                siteNumber: "", // can be multiple
                siteAddress: "", // try use google maps autocomplete
                contactEmail: "",
                deliveryDate: "", // use calendar to pick
                removalDate: "", // use calendar to pick, can be blank
                leadChannel: "", // phone, CMs?, Podium
                leadTag: "", // follow up, booked, or lost
                notes: "", // can be blank
                userID: userID,
                howHear: "",
                otherHowHear: "",
                binSize: "",
                reasonLost: "",
                otherReasonLost: "",
            });
        } else if (reportType === "Front Load") {
            setReport({
                service: "Front Load",
                notes: "",
                userID: userID,
            });
        } else if (reportType === "Swap" || reportType === "Other" || reportType === "Removal") {
            setReport({
                service: reportType,
                siteNumber: "",
                notes: "",
                userID: userID,
            });
        }
    }, [reportType, userID]);

    useEffect(() => {
        if (report.service === "Roll Off") {
            setReport({ ...report, workFlow: "DELIVERRO" });
        } else if (report.service === "Junk Removal") {
            setReport({ ...report, workFlow: "SERVICEJR" });
        } else if (report.service === "Portable Toilet") {
            setReport({ ...report, workFlow: "DELPT" });
        } else if (report.service === "Fencing") {
            setReport({ ...report, workFlow: "DELFE" });
        }
    }, [report.service]);

    function convertToDateObject(dateString) {
        const [month, day, year] = dateString.split("/").map(Number);
        return new Date(year, month - 1, day); // Note: Months are zero-indexed (January is 0)
    }

    const handleSubmitInside = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        if(report.deliveryDate){
            report.deliveryDate = convertToDate(report.deliveryDate);
        }
        if(report.removalDate) {
            report.removalDate = convertToDate(report.removalDate);
            if (convertToDateObject(report.deliveryDate) > convertToDateObject(report.removalDate)) {
                setError("Removal date cannot be before delivery date");
                return;
            }
        }
        const submitInsideSaleReport = async () => {
            await newReport(report, reportType);
            setFormDirty(false);
            window.location.href = "/employeeLanding";
        };
        submitInsideSaleReport();
    };

    const convertToDate = (date) => {
        let newDate = new Date(date);
        let day = newDate.getDate(); // Day of the month, from 1-31
        let month = newDate.getMonth() + 1; // Months are zero-based, so we add 1
        let year = newDate.getFullYear();
        let formattedDate = `${month}/${day}/${year}`;
        return formattedDate;
    };

    const handleSubmitOther = (event) => {
        event.preventDefault();
        setIsSubmitting(true);
        const submitOtherReport = async () => {
            try {
                await newReport(report, reportType);
                setFormDirty(false);
                window.location.href = "/employeeLanding";
            } catch (error) {
                console.log(error);
            }            
        };
        submitOtherReport();
    };    

    if (reportType === "insideSale") {
        return <>
            {error &&
                <Alert severity='error' sx={{ marginBottom: 2 }} onClose={() => setError("")}>
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            }
            <form onSubmit={handleSubmitInside}>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", padding: "0" }}>
                    <FormControl sx={{width:"20%"}}>
                        <InputLabel id="service">Service *</InputLabel>
                        <Select 
                            required 
                            onChange={(event) => handleInputChange(event, "service")}
                            label={"Service"}
                            labelId="service"
                            value={report.service}
                        >
                            <MenuItem value="Roll Off">Roll Off</MenuItem>
                            <MenuItem value="Junk Removal">Junk Removal</MenuItem>
                            <MenuItem value="Portable Toilet">Portable Toilet</MenuItem>
                            <MenuItem value="Fencing">Fencing</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl  sx={{width:"20%"}}>
                        <InputLabel id="workFlow">{report.workFlow || "Work Flow"}</InputLabel>
                        <Select
                            label={"Work Flow"}
                            labelId="workFlow"
                            value={report.workFlow}
                            disabled
                        >
                            <MenuItem value="DELIVERRO">DELIVERRO</MenuItem>
                            <MenuItem value="SERVICEJR">SERVICE-JR</MenuItem>
                            <MenuItem value="DELPT">DELPT</MenuItem>
                            <MenuItem value="DELFE">DELFE</MenuItem>
                        </Select>
                    </FormControl>
                    {report.service === "Roll Off" ? <FormControl style={{display:"flex", flexWrap:"nowrap", flexDirection:"row", alignItems:"center", gap:"1rem"}} sx={{width:"50%"}}>
                        <FormLabel id="binSize">Bin Size (Yards) * :</FormLabel>
                        <RadioGroup
                            label={"Bin Size (Yards)"}
                            labelId="binSize"
                            value={report.binSize}
                            required
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
                            required id="region"
                            value={report.region}
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
                            required
                            label="Address"
                            value={report.siteAddress}
                            onChange={(event) => handleInputChange(event, "siteAddress")}
                        />
                    </FormControl>
                    <FormControl  sx={{width:"25%"}}>
                        <TextField
                            required
                            label="City"
                            value={report.city}
                            onChange={(event) => handleInputChange(event, "city")}
                        />
                    </FormControl>                    
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding:"0" }}>
                    <FormControl  sx={{width:"30%"}}>
                        <TextField
                            required
                            helperText="If not available, enter 'NA'"
                            label="Contact Number"
                            value={report.siteNumber}
                            onChange={(event) => handleInputChange(event, "siteNumber")}
                        />
                    </FormControl>
                    <FormControl  sx={{width:"30%"}}>
                        <TextField
                            label="Contact Name"
                            value={report.contactName}
                            onChange={(event) => handleInputChange(event, "contactName")}
                        />
                    </FormControl>
                    <FormControl  sx={{width:"30%"}}>
                        <TextField
                            required
                            label="Contact Email"
                            value={report.contactEmail}
                            onChange={(event) => handleInputChange(event, "contactEmail")}
                        />
                    </FormControl>
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding:"0"}}>
                    <FormControl  sx={{width:"30%"}}>
                        <TextField
                            required
                            label="Business Name"
                            value={report.siteName}
                            onChange={(event) => handleInputChange(event, "siteName")}
                        />
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Delivery Date"
                            format="MM/DD/YYYY"
                            onChange={(date) => handleInputChange(date, "deliveryDate")}
                            disablePast
                            value={report.deliveryDate || null}
                        />                        
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Removal Date"
                            format="MM/DD/YYYY"
                            value={report.removalDate || null}
                            disablePast
                            onChange={(date) => handleInputChange(date, "removalDate")}
                        />
                    </LocalizationProvider>
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding:"0" }}>
                    <FormControl component="fieldset" sx={{ width: "30%" }}>
                        <FormLabel component="legend">Lead Channel</FormLabel>
                        <RadioGroup
                            required
                            aria-label="Lead Channel"
                            name="leadChannel"
                            value={report.leadChannel}
                            onChange={(event) => handleInputChange(event, "leadChannel")}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <FormControlLabel value="Phone" control={<Radio required={true}/>} label="Phone" />
                            <FormControlLabel value="CMS" control={<Radio required={true}/>} label="CMS" />
                            <FormControlLabel value="Podium" control={<Radio required={true}/>} label="Podium" />
                        </RadioGroup>
                    </FormControl>
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding:"0" }}>
                    <FormControl sx={{ width: "30%" }}>
                        <FormLabel component="legend">Lead Tag</FormLabel>
                        <RadioGroup
                            aria-label="Lead Tags"
                            name="leadTags"
                            value={report.leadTag}
                            onChange={(event) => handleInputChange(event, "leadTag")}
                            style={{ display: "flex", flexDirection: "row" }}
                        >
                            <FormControlLabel value="Follow Up" control={<Radio required={true}/>} label="Follow Up" />
                            <FormControlLabel value="Booked" control={<Radio required={true}/>} label="Booked" />
                            <FormControlLabel value="Lost" control={<Radio required={true}/>} label="Lost" />
                        </RadioGroup>
                    </FormControl>
                    {report.leadTag === "Lost" && (
                        <FormControl sx={{ width: "30%" }}>
                            <InputLabel id="reason-lost">Reason Lost *</InputLabel>
                            <Select
                                required
                                label="Reason Lost"
                                value={report.reasonLost}
                                onChange={(event) => handleInputChange(event, "reasonLost")}
                            >
                                <MenuItem value="Price">Price</MenuItem>
                                <MenuItem value="Competition">Competition</MenuItem>
                                <MenuItem value="No Response">No Response</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>
                    )}
                    {report.reasonLost === "Other" && (
                        <FormControl sx={{ width: "30%" }}>
                        <TextField
                        required
                        label="Other Reason Lost"
                        value={report.otherReasonLost}
                        onChange={(event) => handleInputChange(event, "otherReasonLost")}
                        />
                    </FormControl>
                    )}
                </Container>
                <Container maxWidth="lg" style={{padding:"0", marginTop:"1rem"}}>
                    <FormControl sx={{ width: "100%" }}>
                        <TextField
                            required
                            multiline
                            label="Notes"
                            value={report.notes}
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
                            required
                            value={report.howHear}
                            onChange={(event) => handleInputChange(event, "howHear")}
                        >
                            <MenuItem value="Kijiji">Kijiji</MenuItem>
                            <MenuItem value="Facebook">Facebook</MenuItem>
                            <MenuItem value="Word of Mouth">Word of Mouth</MenuItem>
                            <MenuItem value="Google">Google</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    {report.howHear === "Other" && (
                    <FormControl sx={{ width: "40%" }}>
                        <TextField
                        required
                        label="Other"
                        value={report.otherHowHear}
                        onChange={(event) => handleInputChange(event, "otherHowHear")}
                        />
                    </FormControl>
                    )} 
                </Container>   
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "space-between", gap: "2rem", marginTop: "1rem", padding: "0"}}>
                    <Button type="submit" variant="contained" sx={{ marginBottom: 2 }}>Submit</Button>
                </Container>
            </form>
        </>;        
    } else if (reportType === "Front Load") {
        return <>
            {error &&
                <Alert severity='error' sx={{ marginBottom: 2 }}>
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            }
            <form onSubmit={handleSubmitOther}>
                <Container maxWidth="lg" style={{padding:"0"}}>
                    <FormControl sx={{ width: "100%" }}>
                        <TextField
                            required
                            multiline
                            label="Notes"
                            value={report.notes}
                            onChange={(event) => handleInputChange(event, "notes")}
                        />
                    </FormControl>
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding: "0" }}>
                    <Button type="submit" variant="contained" sx={{ marginBottom: 2 }}>Submit</Button>
                </Container>
            </form>
        </>;
    } else if (reportType === "Swap" || reportType === "Other" || reportType === "Removal") {
        return <>
            {error &&
                <Alert severity='error' sx={{ marginBottom: 2 }}>
                    <AlertTitle>{error}</AlertTitle>
                </Alert>
            }
            <form onSubmit={handleSubmitOther}>
                <Container maxWidth="lg" style={{paddingLeft:"0"}}>
                    <FormControl sx={{ width: "30%", margin:"0 0 1rem 0" }}>
                        <TextField
                            required
                            label="Site Phone Number"
                            value={report.siteNumber}
                            onChange={(event) => handleInputChange(event, "siteNumber")}
                        />
                    </FormControl>
                    <FormControl sx={{ width: "100%" }}>
                        <TextField
                            required
                            multiline
                            label="Notes"
                            value={report.notes}
                            onChange={(event) => handleInputChange(event, "notes")}
                        />
                    </FormControl>
                </Container>
                <Container maxWidth="lg" style={{ display: "flex", justifyContent: "flex-start", gap: "2rem", marginTop: "1rem", padding:"0" }}>
                    <Button type="submit" variant="contained" sx={{ marginBottom: 2 }}>Submit</Button>
                </Container>
            </form>
        </>;
    }
}