import { Select, MenuItem, Alert, AlertTitle, Button, FormControl, InputLabel, CircularProgress, Typography, Table, TableHead, Paper, TableRow, TableCell, TableBody, Container, TableContainer } from "@mui/material";
import {useState, useEffect} from "react";
import { getConversionData, getAllUserID, getAdminStatus, getUserFirstName, getUserLastName, getReportsByDate } from "../utils/queries";
import { styled } from "@mui/system";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const FadeAlert = styled(Alert)(({ theme }) => ({
    opacity: 0,
    transition: "opacity 0.1s ease-in-out",
    "&.show": {
      opacity: 1,
    },
  }));

export default function AccuracyReportGenerator({startDate, endDate}) {
    const [loading, setLoading] = useState(true);
    const [uploadedData, setUploadedData] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [filteredReportData, setFilteredReportData] = useState([]);
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const [telusLeads, setTelusLeads] = useState([]);
    const [podiumLeads, setPodiumLeads] = useState([]);
    const [cmsLeads, setCmsLeads] = useState([]);
    const [towerData, setTowerData] = useState([]);
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const conversion = await getConversionData(startDate.valueOf(), endDate.valueOf());
                setUploadedData(conversion);
                const data = await getReportsByDate(startDate.valueOf(), endDate.valueOf());
                setReportData(data);
                const userIDs = await getAllUserID();
                const updatedResponse = await Promise.all(userIDs.map(async user => {
                    const adminStatus = await getAdminStatus(user);
                    const firstName = await getUserFirstName(user);
                    const lastName = await getUserLastName(user);
                    return [user, `${firstName} ${lastName}`, adminStatus];
                }));
                setUsers(updatedResponse);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching report data:", error);
            }
        };
        fetchReportData();
    }, []);    

    useEffect(() => {
        setLoading(true);
        const refetchData = async () => {
            try {
                const newConversion = await getConversionData(startDate.valueOf(), endDate.valueOf());
                setUploadedData(newConversion);
                console.log(newConversion);
                const newData = await getReportsByDate(startDate.valueOf(), endDate.valueOf());
                setReportData(newData);
                filterUserData(user, newData, newConversion);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching report data:", error);
            }            
        };
        refetchData();
    }, [startDate, endDate]);

    const updateUser = (newUser) => {
        setUser(newUser);
        filterUserData(newUser);
    };    

    function findNestedObject(data, name) {
        for (let key in data) {
            if (data[key].name === name) {
            return data[key];
            }
        }
        return null; // Return null if no matching object is found
    }
    
    function findDataForAllDays(dataArray, name) {
        if (dataArray) {
            return dataArray.reduce((totalLeads, item) => {
            const foundObject = item.data ? findNestedObject(item.data, name) : null;
            return totalLeads + (foundObject ? foundObject.leads : 0);
            }, 0);
        }
    }
      

    const filterUserData =  (newUser, newReportedData = null, newUploadedData = null) => {        
        try{
            const reported = newReportedData || reportData;
            const data = newUploadedData || uploadedData;
            const totalTelusLeads = findDataForAllDays(data.telusData, newUser[1]);
            setTelusLeads(totalTelusLeads);

            const totalPodiumLeads = findDataForAllDays(data.podiumData, newUser[1]);
            setPodiumLeads(totalPodiumLeads);

            const totalCmsLeads = findDataForAllDays(data.cmsData, newUser[1]);
            setCmsLeads(totalCmsLeads);

            if (data.towerData) {
                const filteredTowerData = data.towerData.filter(item => item.data.name === newUser[1]);
                setTowerData(filteredTowerData);
            }
            
            const filterReports = reported.filter(item => item.userID === newUser[0]);
            setFilteredReportData(filterReports);
            console.log(filterReports);
            
        }
        catch (error) {
            console.error("Error filtering user data:", error);
        }
    };

    if (loading) {
        return <>
            <Typography variant="h2" component="h1" align="center">
                <CircularProgress />
            </Typography>
        </>;
    }
    return <>
        <Container maxWidth="md" style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem"}}>
            <FadeAlert severity='error' className={show ? "show" : ""} onClose={() => setError("")}>
                <AlertTitle>{error}</AlertTitle>
            </FadeAlert>
        </Container>
        <Container maxWidth="md" style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem"}}>
            <FormControl style={{width:"250px"}}>
                <InputLabel id="select-employee">Select Employee</InputLabel>
                <Select label="Select Employee" value={user} onChange={(e) => updateUser(e.target.value)}>
                    {users.map((user) => (
                        <MenuItem key={user[0]} value={user}>
                            {user[1]}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Typography variant="h5" component="body" align="center">
                Viewing Accuracy Report for {user[1]}
            </Typography>
        </Container>
        <TableContainer component={Paper} style={{marginBottom:"2rem"}}>
            <Table>
                <TableHead sx={{backgroundColor: "#333333"}}>
                    <TableRow sx={{backgroundColor:"#111111"}}>
                        <TableCell sx={{backgroundColor:"#333333"}}></TableCell>
                        <TableCell style={{borderRight:"2px solid grey",borderLeft:"2px solid black"}} align="center" colSpan={17}>Jobs Completed Per Tower</TableCell>
                        <TableCell style={{borderRight:"2px solid grey",borderLeft:"2px solid black"}} align="center" colSpan={39}>Agent Data</TableCell>
                        <TableCell style={{borderRight:"2px solid grey",borderLeft:"2px solid black"}} align="center" colSpan={8}>Agent Data Verification</TableCell>
                    </TableRow>
                    <TableRow sx={{backgroundColor:"#222222"}}>
                        <TableCell sx={{backgroundColor:"#333333"}}></TableCell>
                        <TableCell style={{borderRight:"2px solid black",borderLeft:"2px solid black"}} align="center" colSpan={13}>Jobs Completed</TableCell>
                        <TableCell colSpan={3} align="center">Leads Taken</TableCell>
                        <TableCell rowSpan={3} style={{borderLeft:"2px solid black", borderRight:"2px solid black"}} align="center">Total Leads</TableCell>
                        <TableCell colSpan={13} style={{borderRight:"2px solid black"}} align="center">Inbound Sales Calls</TableCell>
                        <TableCell colSpan={13} style={{borderRight:"2px solid black"}} align="center">Podium Leads</TableCell>
                        <TableCell colSpan={13} style={{borderRight:"2px solid black"}} align="center">CMS Leads</TableCell>                        
                        <TableCell colSpan={2} rowSpan={2} style={{borderRight:"2px solid black"}} align="center">Call Difference</TableCell>
                        <TableCell colSpan={2} rowSpan={2} style={{borderRight:"2px solid black"}} align="center">Podium Difference</TableCell>
                        <TableCell colSpan={2} rowSpan={2} style={{borderRight:"2px solid black"}} align="center">CMS Difference</TableCell>
                        <TableCell colSpan={2} rowSpan={2} style={{borderRight:"2px solid black"}} align="center">Booking Difference</TableCell>
                    </TableRow>
                    <TableRow style={{borderBottom:"2px solid black", borderTop:"2px solid black"}}>
                        <TableCell rowSpan={2} align="center">Date</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"2px solid black"}}>DELIVERRO</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderRight:"2px solid black"}}>SERVICEJR</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderRight:"2px solid black"}}>DELPT</TableCell>
                        <TableCell colSpan={3} align="center" >DELFENCING</TableCell>
                        <TableCell align="center" rowSpan={2} style={{borderRight:"2px solid black", borderLeft:"2px solid black"}}> Total Jobs Completed</TableCell>
                        <TableCell rowSpan={2} style={{borderRight:"1px solid grey"}} align="center">Podium Leads</TableCell>
                        <TableCell rowSpan={2} style={{borderRight:"1px solid grey"}} align="center">CMS Leads</TableCell>
                        <TableCell rowSpan={2}align="center"># Inbound Calls</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>RO</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>JR</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>PT</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"2px solid black", padding:"0.5rem"}}>FE</TableCell>
                        <TableCell rowSpan={2} align="Center" style={{borderLeft:"2px solid black",borderRight:"2px solid black"}}>Total Calls</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>RO</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>JR</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>PT</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"2px solid black", padding:"0.5rem"}}>FE</TableCell>
                        <TableCell rowSpan={2} align="Center" style={{borderLeft:"2px solid black",borderRight:"2px solid black"}}>Total Podium</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>RO</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>JR</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>PT</TableCell>
                        <TableCell colSpan={3} align="center" style={{borderLeft:"2px solid black",borderRight:"2px solid black", padding:"0.5rem"}}>FE</TableCell>
                        <TableCell rowSpan={2} align="Center" style={{borderLeft:"2px solid black",borderRight:"2px solid black"}}>Total CMS</TableCell>
                        
                    </TableRow>
                    <TableRow style={{borderBottom:"2px solid black", borderTop:"2px solid black"}}>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>RO</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>JR</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>PT</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>FE</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey", padding:"0.5rem"}}>RO</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>JR</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>PT</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>FE</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>RO</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>JR</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>PT</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>FE</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>RO</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>JR</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>PT</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell align="center" style={{borderLeft:"2px solid black",borderRight:"1px solid grey", padding:"0.5rem"}}>FE</TableCell>
                        <TableCell align="center" style={{borderRight:"1px solid grey",padding:"0.5rem"}}>EDM</TableCell>
                        <TableCell align="center" style={{borderRight:"2px solid black",padding:"0.5rem"}}>CAL</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="center">#</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="center">%</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="center">#</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="center">%</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="center">#</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="center">%</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="center">#</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="center">%</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow style={{padding:"0"}}>
                        <TableCell style={{borderRight:"2px solid black", textWrap:"nowrap"}} align="right" >Week 1</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{towerData.filter(item => item.data.workFlow === "DELIVERRO").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{towerData.filter(item => item.data.workFlow === "DELIVERRO" && item.data.region == "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{towerData.filter(item => item.data.workFlow === "DELIVERRO" && item.data.region == "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{towerData.filter(item => item.data.workFlow === "SERVICEJR").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{towerData.filter(item => item.data.workFlow === "SERVICEJR" && item.data.region == "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{towerData.filter(item => item.data.workFlow === "SERVICEJR" && item.data.region == "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{towerData.filter(item => item.data.workFlow === "DELPT").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{towerData.filter(item => item.data.workFlow === "DELPT" && item.data.region == "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{towerData.filter(item => item.data.workFlow === "DELPT" && item.data.region == "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{towerData.filter(item => item.data.workFlow === "DELFENCING").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{towerData.filter(item => item.data.workFlow === "DELFENCING" && item.data.region == "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{towerData.filter(item => item.data.workFlow === "DELFENCING" && item.data.region == "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black", fontWeight:"Bold"}} align="right">{towerData.length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{podiumLeads}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{cmsLeads}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{telusLeads}</TableCell>
                        <TableCell style={{fontWeight:"bold", borderRight:"2px solid black"}} align="right">{podiumLeads + cmsLeads + telusLeads}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "DELIVERRO").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "DELIVERRO" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "DELIVERRO" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "SERVICEJR").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "SERVICEJR" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "SERVICEJR" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "DELPT").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "DELPT" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "DELPT" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "DELFE").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "DELFE" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Phone" && item.workFlow === "DELFE" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black", fontWeight:"Bold"}} align="right">{filteredReportData.filter(item => ["DELIVERRO", "SERVICEJR", "DELPT", "DELFE"].includes(item.workFlow) && item.leadChannel === "Phone").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "DELIVERRO").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "DELIVERRO" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "DELIVERRO" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "SERVICEJR").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "SERVICEJR" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "SERVICEJR" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "DELPT").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "DELPT" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "DELPT" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "DELFE").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "DELFE" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "Podium" && item.workFlow === "DELFE" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black", fontWeight:"Bold"}} align="right">{filteredReportData.filter(item => ["DELIVERRO", "SERVICEJR", "DELPT", "DELFE"].includes(item.workFlow) && item.leadChannel === "Podium").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "DELIVERRO").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "DELIVERRO" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "DELIVERRO" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "SERVICEJR").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "SERVICEJR" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "SERVICEJR" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "DELPT").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "DELPT" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "DELPT" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "DELFE").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "DELFE" && item.region === "Edmonton").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">{filteredReportData.filter(item => item.leadChannel === "CMS" && item.workFlow === "DELFE" && item.region === "Calgary").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black", fontWeight:"Bold"}} align="right">{filteredReportData.filter(item => ["DELIVERRO", "SERVICEJR", "DELPT", "DELFE"].includes(item.workFlow) && item.leadChannel === "CMS").length}</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => ["DELIVERRO", "SERVICEJR", "DELPT", "DELFE"].includes(item.workFlow) && item.leadChannel === "Phone").length - telusLeads}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">
                            {(() => {
                                if (telusLeads === 0) {
                                    return "0%";
                                } else {
                                    const percentage = ((filteredReportData.filter(item => ["DELIVERRO", "SERVICEJR", "DELPT", "DELFE"].includes(item.workFlow) && item.leadChannel === "Phone").length / telusLeads) * 100).toFixed(1);
                                    return isNaN(percentage) ? "0%" : `${percentage}%`;
                                }
                            })()}
                        </TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => ["DELIVERRO", "SERVICEJR", "DELPT", "DELFE"].includes(item.workFlow) && item.leadChannel === "Podium").length - podiumLeads}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">
                            {(() => {
                                if (podiumLeads === 0) {
                                    return "0%";
                                } else {
                                    const percentage = ((filteredReportData.filter(item => ["DELIVERRO", "SERVICEJR", "DELPT", "DELFE"].includes(item.workFlow) && item.leadChannel === "Podium").length / podiumLeads) * 100).toFixed(1);
                                    return isNaN(percentage) ? "0%" : `${percentage}%`;
                                }
                            })()}
                        </TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{filteredReportData.filter(item => ["DELIVERRO", "SERVICEJR", "DELPT", "DELFE"].includes(item.workFlow) && item.leadChannel === "CMS").length - cmsLeads}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">
                            {(() => {
                                if (cmsLeads === 0) {
                                    return "0%";
                                } else {
                                    const percentage = ((filteredReportData.filter(item => ["DELIVERRO", "SERVICEJR", "DELPT", "DELFE"].includes(item.workFlow) && item.leadChannel === "CMS").length / cmsLeads) * 100).toFixed(1);
                                    return isNaN(percentage) ? "0%" : `${percentage}%`;
                                }
                            })()}
                        </TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">{towerData.length - filteredReportData.filter(item => item.leadTag === "Booked").length}</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">
                            {(() => {
                                if (towerData.length === 0) {
                                    return "0%";
                                } else {
                                    const percentage = ((filteredReportData.filter(item => item.leadTag === "Booked").length / towerData.length) * 100).toFixed(1);
                                    return isNaN(percentage) ? "0%" : `${percentage}%`;
                                }
                            })()}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </>;
}