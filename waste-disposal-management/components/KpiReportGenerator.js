import { useEffect, useState } from "react";
import { auth } from "../utils/firebaseConfig";
import { Select, MenuItem, InputLabel, CircularProgress, FormControlLabel, Checkbox, Container, Typography, FormControl, Button } from "@mui/material";
import { getAllUserID, getUserFirstName, getUserLastName, getAdminStatus } from "../utils/queries";
import KpiReport from "./KpiReport";

export default function KpiReportGenerator({startDate, endDate}) {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [employee, setEmployee] = useState("");
    const [service, setService] = useState("");
    const [leadTag, setLeadTag] = useState("");
    const [leadChannel, setLeadChannel] = useState("");
    const [howHeard, setHowHeard] = useState("");
    const [region, setRegion] = useState("");
    const [adminsFiltered, setAdminsFiltered] = useState(true);

    useEffect(() => {
        const fetchUserIDs = async () => {
            try {
                const response = await getAllUserID();
                const updatedResponse = await Promise.all(response.map(async user => {
                    const adminStatus = await getAdminStatus(user);
                    const firstName = await getUserFirstName(user);
                    const lastName = await getUserLastName(user);
                    return [user, `${firstName} ${lastName}`, adminStatus];
                }));
                setUsers(updatedResponse);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user IDs:", error);
            }
        };
        fetchUserIDs();
    },[]);

    const resetFilters = () => {
        setEmployee("");
        setService("");
        setLeadTag("");
        setLeadChannel("");
        setHowHeard("");
        setRegion("");
        setAdminsFiltered(true);
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
    <Container maxWidth="xl">
        <Container maxWidth="xl" style={{display:"flex", justifyContent:"space-evenly", alignItems:"start", marginBottom:"4rem"}}>
            <form style={{display:"flex", justifyContent:"space-evenly", alignItems:"start", width:"100%"}}>
                <Container style={{maxWidth:"max-content", display:"flex", flexDirection: "column", margin:"0", padding: "0"}}>
                    <FormControl sx={{width: "100%"}}>
                        <InputLabel id="employee">Employee</InputLabel>
                        <Select
                            labelId="employee"
                            label={"Employee"}
                            onChange={(e) => setEmployee(e.target.value)}
                            value={employee}
                        >
                            <MenuItem value={""}>All Employees</MenuItem>
                            {users.filter(user => !(user[2] && adminsFiltered)).map(user => <MenuItem key={user} value={user}>{user[1]}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControlLabel control={<Checkbox checked={adminsFiltered} onChange={(event) => setAdminsFiltered(event.target.checked)} />} label='Exclude Management'/>
                </Container>
                <FormControl sx={{width: "14%"}}>
                    <InputLabel id="Service-type">Service Type</InputLabel>
                    <Select
                        labelId="Service-type"
                        label={"Service Type"}
                        onChange={(e) => setService(e.target.value)}
                        value={service}
                    >
                        <MenuItem value="">All Services</MenuItem>
                        <MenuItem value={"Roll Off"}>Roll Off</MenuItem>
                        <MenuItem value={"Junk Removal"}>Junk Removal</MenuItem>
                        <MenuItem value={"Portable Toilet"}>Portable Toilet</MenuItem>
                        <MenuItem value={"Fencing"}>Fencing</MenuItem>
                        <MenuItem value={"Other"}>All Other Services</MenuItem>
                        <MenuItem value={"Front Load"}>Front Load</MenuItem>
                        <MenuItem value={"Swap"}>Swap</MenuItem>
                        <MenuItem value={"Removal"}>Removal</MenuItem>
                    </Select>
                </FormControl>                
                <FormControl sx={{width: "12%"}}>
                    <InputLabel id="outcome">Outcome</InputLabel>
                    <Select
                        labelId="outcome"
                        label={"Outcome"}
                        onChange={(e) => setLeadTag(e.target.value)}
                        value={leadTag}
                    >
                        <MenuItem value={""}>All Outcomes</MenuItem>
                        <MenuItem value={"Booked"}>Booked</MenuItem>
                        <MenuItem value={"Follow Up"}>Follow Up</MenuItem>
                        <MenuItem value={"Lost"}>Lost</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{width: "11%"}}>
                    <InputLabel id="lead-channel">Channel</InputLabel>
                    <Select
                        labelId="lead-channel"
                        label={"Channel"}
                        onChange={(e) => setLeadChannel(e.target.value)}
                        value={leadChannel}
                    >
                        <MenuItem value={""}>All Channels</MenuItem>
                        <MenuItem value={"CMS"}>CMS</MenuItem>
                        <MenuItem value={"Podium"}>Podium</MenuItem>
                        <MenuItem value={"Phone"}>Phone</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{width: "14%"}}>
                    <InputLabel id="how-heard">Discovered</InputLabel>
                    <Select
                        labelId="how-heard"
                        label={"Discovered"}
                        onChange={(e) => setHowHeard(e.target.value)}
                        value={howHeard}
                    >
                        <MenuItem value="">All Discovered</MenuItem>
                        <MenuItem value={"Kijiji"}>Kijiji</MenuItem>
                        <MenuItem value={"Facebook"}>Facebook</MenuItem>
                        <MenuItem value={"Google"}>Google</MenuItem>
                        <MenuItem value={"Word of Mouth"}>Word of Mouth</MenuItem>
                        <MenuItem value={"Other"}>Other</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{width: "11%"}}>
                    <InputLabel id="region">Region</InputLabel>
                    <Select
                        labelId="region"
                        label={"Region"}
                        onChange={(e) => setRegion(e.target.value)}
                        value={region}
                    >
                        <MenuItem value={""}>All Regions</MenuItem>
                        <MenuItem value={"Edmonton"}>Edmonton</MenuItem>
                        <MenuItem value={"Calgary"}>Calgary</MenuItem>
                    </Select>
                </FormControl>
            </form>
            <Container style={{maxWidth:"max-content", padding:"0", margin:"0", display: "flex", flexDirection:"column", gap:"1rem"}}>
                <Button variant="contained" color="secondary" onClick={resetFilters}>Reset Filters</Button>
            </Container>
        </Container>
        <Container maxWidth="xl" style={{display:"flex", justifyContent:"center", alignItems:"center", marginBottom:"4rem"}}>
            <KpiReport employee={employee} users={users} service={service} leadTag={leadTag} leadChannel={leadChannel} howHeard={howHeard} region={region} adminsFiltered={adminsFiltered} startDate={startDate} endDate={endDate} />
        </Container>
    </Container>
    </>;
}