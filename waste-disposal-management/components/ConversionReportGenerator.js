import { CircularProgress, Typography, Table, TableHead, Paper, TableRow, TableCell, TableBody, Container, TableContainer } from '@mui/material';
import {useState, useEffect} from 'react';
import { getConversionData } from '../utils/queries';

export default function ConversionReportGenerator({startDate, endDate}) {
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

    return <>
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
                        <TableCell align="right" style={{textWrap:"nowrap"}}>Jacqueline Sinclair</TableCell>
                        <TableCell align="right" style={{borderLeft:"2px solid black"}}>4</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>5</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>2</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>10</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>21</TableCell>
                        <TableCell align="right" style={{borderLeft:"2px solid black"}}>3</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>5</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>13</TableCell>
                        <TableCell align="right" style={{borderLeft:"1px solid grey"}}>21</TableCell>
                        <TableCell align="right" style={{borderLeft:"2px solid black"}}>100%</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </>
}