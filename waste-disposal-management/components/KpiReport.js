import { Container, Typography, CircularProgress, Grid, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { getAllReports } from "../utils/queries";

export default function KpiReport({employee, users, service, leadTag, leadChannel, howHeard, region, adminsFiltered, startDate, endDate}) {
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [fetchedReports, setFetchedReports] = useState([]);
    const usersMap = new Map(users.map(user => [user[0], user.slice(1)]));
    const usersObj = Object.fromEntries(users);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allReports = await getAllReports();
                setFetchedReports(allReports); // Store raw data in fetchedReports
                let tempReports = [...allReports];
                tempReports = tempReports.filter(report => report.dateReported.toDate().valueOf() >= startDate.valueOf() && report.dateReported.toDate().valueOf() <= endDate.valueOf());
                if(adminsFiltered) {
                    tempReports = tempReports.filter(report => {
                        const user = usersMap.get(report.userID);
                        // Exclude the report if the user is an admin
                        return user ? !user[1] : true;
                    });
                }  
                setReports(tempReports); // Store raw data in reports
                setLoading(false);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);    

    function formatJSON(json) {
        return Object.entries(json).map(([key, value]) => {
            // Look up the user name using the key
            const userName = usersObj[key];
            if (userName) {
                if(usersMap.get(key)[1] === true && adminsFiltered) {
                    return null;
                }
                if(employee && employee[0] !== key) {
                    return null;
                }
                // If the user name is found, return it instead of the key
                return `${userName}: ${value}`;
            } else {
                // If the user name is not found, return the key-value pair as before
                return `${key}: ${value}`;
            }
        }).filter(item => item !== null).join("\n");
    }

    useEffect(() => {
        let tempReports = [...fetchedReports]; // Create a copy of fetchedReports
        tempReports = tempReports.filter(report => report.dateReported.toDate().valueOf() >= startDate.valueOf() && report.dateReported.toDate().valueOf() <= endDate.valueOf());
        if(employee) {
            tempReports = tempReports.filter(report => report.userID === employee[0]);
        }
        if(adminsFiltered) {
            tempReports = tempReports.filter(report => {
                const user = usersMap.get(report.userID);
                // Exclude the report if the user is an admin
                return user ? !user[1] : true;
            });
        }         
        if(service) {
            tempReports = tempReports.filter(report => report.service === service || report.reportType  === service);
        }
        if(leadTag) {
            tempReports = tempReports.filter(report => report.leadTag === leadTag);
        }
        if(leadChannel) {
            tempReports = tempReports.filter(report => report.leadChannel === leadChannel);
        }
        if(howHeard) {
            tempReports = tempReports.filter(report => report.howHear === howHeard);
        }
        if(region) {
            tempReports = tempReports.filter(report => report.region === region);
        }

        setReports(tempReports);
    }, [employee, service, leadTag, leadChannel, howHeard, region, adminsFiltered, startDate, endDate]);
        
    
    if (loading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress />
                </Typography>
            </Container>
        );
    } else {
        const allPossibleValues = { // replace with actual possible values
            "userID": [...usersMap.keys()],
            "service": service ? [service] : ["Roll Off", "Junk Removal", "Portable Toilet", "Fencing", "Front Load", "Swap", "Removal", "Other"],
            "leadTag": leadTag ? [leadTag] : ["Booked", "Follow Up", "Lost"],
            "leadChannel": leadChannel ? [leadChannel] : ["CMS", "Podium", "Phone"],
            "howHear": howHeard ? [howHeard] : ["Kijiji", "Google", "Word of Mouth", "Other", "Facebook"],
            "region": region ? [region] : ["Edmonton", "Calgary"]
        };
        const countByField = (field) => {
            const counts = {};
            allPossibleValues[field].forEach(value => {
                counts[value] = 0;
            });
            reports.forEach((report) => {
                const value = report[field];
                if (value) {
                    counts[value]++;
                }
            });
            return counts;
        };

        const employeeCounts = countByField("userID");
        const serviceCounts = countByField("service");
        const leadTagCounts = countByField("leadTag");
        const leadChannelCounts = countByField("leadChannel");
        const howHeardCounts = countByField("howHear");
        const regionCounts = countByField("region");

        return (
            <Container maxWidth="xl">
                <Grid container spacing={2} >
                    <Grid item xs={12} sm={2} style={{height:"300px"}}>
                        <Box p={1} style={{borderRadius:"5px", backgroundColor:"#73726f", height:"100%"}}>
                            <Typography variant="h4" component="h1" >Employee</Typography>
                            <Typography variant="body1" component="pre" >{formatJSON(employeeCounts)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Box p={1} style={{borderRadius:"5px", backgroundColor:"#73726f", height:"100%"}}>
                            <Typography variant="h4" component="h1" >Service</Typography>
                            <Typography variant="body1" component="pre" >{formatJSON(serviceCounts)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Box p={1} style={{borderRadius:"5px", backgroundColor:"#73726f", height:"100%"}}>
                            <Typography variant="h4" component="h1" >Outcome</Typography>
                            <Typography variant="body1" component="pre" >{formatJSON(leadTagCounts)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Box p={1} style={{borderRadius:"5px", backgroundColor:"#73726f", height:"100%"}}>
                            <Typography variant="h4" component="h1" >Channel</Typography>
                            <Typography variant="body1" component="pre" >{formatJSON(leadChannelCounts)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Box p={1} style={{borderRadius:"5px", backgroundColor:"#73726f", height:"100%"}}>
                            <Typography variant="h4" component="h1" >Discovered</Typography>
                            <Typography variant="body1" component="pre" >{formatJSON(howHeardCounts)}</Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Box p={1} style={{borderRadius:"5px", backgroundColor:"#73726f", height:"100%"}}>
                            <Typography variant="h4" component="h1" >Region</Typography>
                            <Typography  variant="body1" component="pre" >{formatJSON(regionCounts)}</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}