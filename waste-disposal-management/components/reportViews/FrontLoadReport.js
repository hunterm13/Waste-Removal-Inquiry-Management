import { Button, Container, FormControl, InputLabel, TextField, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { deleteReportById, updateReportById } from "../../utils/queries";

export default function FrontLoadReport({report, reportID}) {
    const [reportData, setReportData] = useState(report);
    const [editing, setEditing] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);

    const formatDateLocale = (date) => {
        const dateMilliseconds = date.seconds * 1000 + date.nanoseconds / 1000000;
        const formattedDate = new Date(dateMilliseconds);
        return formattedDate.toLocaleString();
    };
    const formattedDateReported = formatDateLocale(reportData.dateReported);
    const formattedDateUpdated = reportData.dateUpdated ? formatDateLocale(reportData.dateUpdated) : null;    

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

    const handleChange = (dataType, event) => {
        setReportData({...reportData, [dataType]: event.target.value});
        setIsFormDirty(true);
    };

    const handleEdit = () => {
        if (editing && isFormDirty) {
            console.log(reportData);
            const confirmSave = window.confirm("Are you sure you want to save changes?");
            if (confirmSave) {
                updateReportById(reportID, reportData);
                setEditing(false);
            }
        } else {
            setEditing(true);
        }
    };

    const handleCancel = () => {
        if(isFormDirty){
            const confirmCancel = window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.");
            if (confirmCancel) {
                setEditing(false);
            }
        }else{
            setEditing(false);
        }
    };

    return <>
        <Container maxWidth="lg">
            <Container maxWidth='lg' style={{padding:"0", display:"flex", justifyContent: "space-between" }}>
                <Typography variant="h2" style={{marginBottom:"2rem"}} component="h1">Front Load Report Details</Typography>
                <Button variant="contained" style={{height:"fit-content"}} onClick={handleDelete} color="alert">Delete Report</Button>
            </Container>
            <Typography variant="h5" component="h2">Notes: </Typography>
            {reportData && editing ? <form>
                <FormControl fullWidth>
                    <TextField
                        value={reportData.notes}
                        multiline
                        required
                        onChange={(event) => handleChange("notes",event)}
                    />
                </FormControl>
            </form> : 
                <Container style={{ maxWidth: "100%", lineHeight:"1.5", padding:"1rem 0"}}>
                    <Typography>{reportData.notes}</Typography>
                </Container>}            
            <Container style={{display:"flex", padding:"0", justifyContent:"space-between", marginTop:"1rem"}}>
                <Button variant="contained" onClick={() => (router.back())}>Back</Button>
                <Container style={{margin:"0", width:"fit-content", display:"flex", gap:"1rem"}}>
                    {editing && <Button variant="contained" color="alert" onClick={handleCancel}>Cancel</Button>}
                    <Button variant="contained" onClick={handleEdit}>{editing ? "Save" : "Edit"}</Button>                    
                </Container>
            </Container>
            <Typography variant="body1" style={{marginTop:"1rem"}} component="h2">Date Reported: {formattedDateReported}</Typography>
            {report.dateUpdated ? <Typography variant="body1" component="h2">Date Last Updated: {formattedDateUpdated}</Typography> : null}
        </Container>
    </>;
}
