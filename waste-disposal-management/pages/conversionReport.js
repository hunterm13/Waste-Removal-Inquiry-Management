import { useState, useEffect } from "react";
import { auth } from "../utils/firebaseConfig";
import { getAdminStatus, getAllReports } from "../utils/queries";
import { AlertTitle, FormControl, Container, InputLabel, Typography, CircularProgress, Select, MenuItem, Button, Alert } from "@mui/material";
import FileDropzone from "../components/FileDropzone";
import dayjs from "dayjs";
import ConversionReportGenerator from "../components/AccuracyReportGenerator";
import { styled } from "@mui/system";

const FadeAlert = styled(Alert)(({ theme }) => ({
    opacity: 0,
    marginBottom: '1rem',
    transition: 'opacity 0.1s ease-in-out',
    '&.show': {
      opacity: 1,
    },
  }));

export default function ConversionReport() {
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [creatingReport, setCreatingReport] = useState(false);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [formUploadingType, setformUploadingType] = useState("Please Select a Report Type");
    const [success, setSuccess] = useState(false);

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
        {success && (
            <Container maxWidth="xl">
                <Alert severity="success" onClose={() => setSuccess(false)}>
                    <AlertTitle>Upload Success</AlertTitle>
                </Alert>
            </Container>
        )}
        <Container maxWidth="md">
            <Typography variant="h2" component="h1" align="center">
                Conversion Report
            </Typography>
            
            {!uploadingFile && !creatingReport && (
            <Container maxWidth="sm" style={{display:"flex", justifyContent: "space-around", marginTop:"3rem"}}>
                <Button variant="contained" onClick={() => setUploadingFile(true)}>Upload File</Button>
                <Button variant="contained" onClick={() => setCreatingReport(true)}>Create Report</Button>
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
        {creatingReport && (
            <Container maxWidth="xl">
                <ConversionReportGenerator />
                <Container>
                    <Button variant="contained" color="secondary" onClick={() => {
                        setUploadingFile(false);
                        setCreatingReport(false);
                    }}>Cancel</Button>
                </Container>
            </Container>
        )}
    </>;
};
