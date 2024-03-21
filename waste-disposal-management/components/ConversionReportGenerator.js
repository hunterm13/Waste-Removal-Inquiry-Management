import { CircularProgress, Alert, AlertTitle, FormControl, InputLabel, MenuItem, Select, Typography, Table, TableHead, Paper, TableRow, TableCell, TableBody, Container, TableContainer } from '@mui/material';
import {useState, useEffect} from 'react';
import { getAllUserID, getConversionData, getAdminStatus, getUserFirstName, getUserLastName } from '../utils/queries';
import { styled } from '@mui/system';

const FadeAlert = styled(Alert)(({ theme }) => ({
    opacity: 0,
    marginBottom: '1rem',
    transition: 'opacity 0.1s ease-in-out',
    '&.show': {
      opacity: 1,
    },
  }));

export default function ConversionReportGenerator({startDate, endDate}) {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState([]);
    const [open, setOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState([]);
    const [telusLeads, setTelusLeads] = useState([]);
    const [podiumLeads, setPodiumLeads] = useState([]);
    const [cmsLeads, setCmsLeads] = useState([]);
    const [towerData, setTowerData] = useState([]);
    const [show, setShow] = useState(false);
    const [error, setError] = useState("");
    const [totalLeads, setTotalLeads] = useState(0);
    const [totalJobsBooked, setTotalJobsBooked] = useState(0);

    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const conversion = await getConversionData("03-01-2024", "03-30-2024");
                setReportData(conversion);
                console.log(conversion)
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

    // useEffect(() => {
    //     const fetchReportData = async () => {
    //         try {                
    //             const conversion = await getConversionData("03-01-2024", "03-30-2024");
    //             setReportData(conversion);
    //             setLoading(false);
    //         } catch (error) {
    //             console.error("Error fetching report data:", error);
    //         }
    //     };
    //     fetchReportData();
    // }, [startDate, endDate]);

    const updateUser = (newUser) => {
        setUser(newUser);
        filterUserData(newUser);
    }    

    function findNestedObject(data, name) {
        for (let key in data) {
            if (data[key].name === name) {
            return data[key];
            }
        }
        return null; // Return null if no matching object is found
    }
    
    function findDataForAllDays(dataArray, name) {
        return dataArray.reduce((totalLeads, item) => {
            const foundObject = item.data ? findNestedObject(item.data, name) : null;
            return totalLeads + (foundObject ? foundObject.leads : 0);
        }, 0);
    }
      

    const filterUserData =  (newUser) => {        
        try{
            const totalTelusLeads = findDataForAllDays(reportData.telusData, newUser[1]);
            setTelusLeads(totalTelusLeads);

            const totalPodiumLeads = findDataForAllDays(reportData.podiumData, newUser[1]);
            setPodiumLeads(totalPodiumLeads);

            const totalCmsLeads = findDataForAllDays(reportData.cmsData, newUser[1]);
            setCmsLeads(totalCmsLeads);

            const filteredTowerData = reportData.towerData.filter(item => item.data.name === newUser[1]);
            setTowerData(filteredTowerData);
            
            setTotalLeads(totalTelusLeads + totalPodiumLeads + totalCmsLeads);
            setTotalJobsBooked(filteredTowerData.length);
            
        }
        catch (error) {
            console.error("Error filtering user data:", error);
        }

    }


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
        <Container maxWidth="md" style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem"}}>
            <FadeAlert severity='error' className={show ? 'show' : ''} onClose={() => setError("")}>
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
                Viewing Conversion Report for {user[1]}
            </Typography>
        </Container>
        <TableContainer component={Paper} style={{marginBottom:"3rem"}}>
            <Table>
                <TableHead>
                    <TableRow sx={{backgroundColor: "#222222"}}>
                        <TableCell rowSpan={2} align="center">Name</TableCell>
                        <TableCell colSpan={5} style={{borderRight:"2px solid black", borderLeft:"2px solid black"}} align="center">Jobs Booked</TableCell>
                        <TableCell colSpan={4} style={{borderRight:"2px solid black"}} align="center">Leads</TableCell>
                        <TableCell rowSpan={2}  align="center">Conversion %</TableCell>
                    </TableRow>
                    <TableRow sx={{backgroundColor: "#333333", borderBottom:"2px solid black"}}>
                        <TableCell style={{borderRight:"2px solid black", borderLeft:"2px solid black"}} align="center">DELIVERRO - Roll Off</TableCell>
                        <TableCell style={{borderRight:"2px solid black", borderLeft:"2px solid black"}} align="center">SERVICEJR - Junk Removal</TableCell>
                        <TableCell style={{borderRight:"2px solid black", borderLeft:"2px solid black"}} align="center">DELPT - Portable Toilet</TableCell>
                        <TableCell style={{borderRight:"2px solid black", borderLeft:"2px solid black"}} align="center">DELFENCING - Fencing</TableCell>
                        <TableCell style={{borderRight:"2px solid black", borderLeft:"2px solid black"}} align="center">Total Jobs Booked</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="center">Poduim Leads</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="center">CMS Leads</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="center">Inbound Calls</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="center">Total Leads</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="right" style={{textWrap:"nowrap"}}>{user[1]}</TableCell>
                        <TableCell align="right" style={{borderLeft:"2px solid black"}}>{towerData.filter(item => item.data.workFlow === "DELIVERRO").length}</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>{towerData.filter(item => item.data.workFlow === "SERVICEJR").length}</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>{towerData.filter(item => item.data.workFlow === "DELPT").length}</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>{towerData.filter(item => item.data.workFlow === "DELFENCING").length}</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>{towerData.length}</TableCell>
                        <TableCell align="right" style={{borderLeft:"2px solid black"}}>{podiumLeads}</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>{cmsLeads}</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>{telusLeads}</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>{telusLeads+cmsLeads+podiumLeads}</TableCell>
                        <TableCell align="right" style={{borderLeft:"2px solid black"}}>{((totalJobsBooked/totalLeads)*100).toFixed(2)}%</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </>
}