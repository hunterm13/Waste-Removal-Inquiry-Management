import { CircularProgress, Collapse, IconButton, Typography, Table, TableHead, Paper, TableRow, TableCell, TableBody, Container, TableContainer } from '@mui/material';
import {useState, useEffect} from 'react';
import { getConversionData } from '../utils/queries';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

export default function AccuracyReportGenerator({startDate, endDate}) {
    const [loading, setLoading] = useState(true);
    const [reportData, setReportData] = useState([]);
    const [open, setOpen] = useState(false);


    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const response = await getConversionData("03-01-2024", "03-30-2024");
                setReportData(response);
                setLoading(false);
                console.log(response)
            } catch (error) {
                console.error("Error fetching report data:", error);
            }
        };
        //fetchReportData();
        setLoading(false);
    }, []);
    
    if (loading) {
        return <>
            <Typography variant="h2" component="h1" align="center">
                <CircularProgress />
            </Typography>
        </>
    }
    return <>
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{backgroundColor: "#333333"}}>
                    <TableRow sx={{backgroundColor:"#111111"}}>
                        <TableCell sx={{backgroundColor:"#333333"}}></TableCell>
                        <TableCell style={{borderRight:"2px solid grey",borderLeft:"2px solid black"}} align="center" colSpan={17}>Jobs Completed Per Tower</TableCell>
                        <TableCell style={{borderRight:"2px solid grey",borderLeft:"2px solid black"}} align="center" colSpan={39}>Agent Data</TableCell>
                        <TableCell style={{borderRight:"2px solid grey",borderLeft:"2px solid black"}} align="center" colSpan={6}>Agent Data Verification</TableCell>
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
                        <TableCell rowSpan={2} align="Center" style={{borderLeft:"2px solid black",borderRight:"2px solid black"}}>Total CMS</TableCell>
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow style={{padding:"0"}}>
                        <TableCell style={{borderRight:"2px solid black", textWrap:"nowrap"}} align="right" >Week 1</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">31</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">16</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">22</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">14</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">43</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">33</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">98</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">43</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">33</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">98</TableCell>
                        <TableCell style={{borderRight:"2px solid black", fontWeight:"Bold"}} align="right">308</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">43</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">33</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">98</TableCell>
                        <TableCell style={{fontWeight:"bold"}} align="right">98</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">31</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">16</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">22</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">14</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">43</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">33</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">98</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">43</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">33</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">98</TableCell>
                        <TableCell style={{borderRight:"2px solid black", fontWeight:"Bold"}} align="right">308</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">31</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">16</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">22</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">14</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">43</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">33</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">98</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">43</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">33</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">98</TableCell>
                        <TableCell style={{borderRight:"2px solid black", fontWeight:"Bold"}} align="right">308</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">31</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">16</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">22</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">14</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">43</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">33</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">98</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">43</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">33</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">98</TableCell>
                        <TableCell style={{borderRight:"2px solid black", fontWeight:"Bold"}} align="right">308</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">31</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">16</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">23</TableCell>
                        <TableCell style={{borderRight:"1px solid grey"}} align="right">22</TableCell>
                        <TableCell style={{borderRight:"2px solid black"}} align="right">14</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </>
}