import { TableRow, TableCell, Container, CircularProgress, Typography, Table, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserFirstName, getUserKpi, getUserLastName } from "../utils/queries";
import KpiSingleBar from "./KpiSingleBar";

export default function KpiRow({userID, startDate, endDate}) {
    const [loading, setLoading] = useState(true);
    const [booked, setBooked] = useState(0);
    const [inquiries, setInquiries] = useState(0);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        const fetchUserKpi = async () => {
            try {
                const response = await getUserKpi(userID,startDate,endDate);
                setBooked(response.totalBooked);
                setInquiries(response.totalInquiries);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user KPI:", error);
            }
        };
        const fetchUserFirstName = async () => {
            try {
                const response = await getUserFirstName(userID);
                setFirstName(response);
            } catch (error) {
                console.error("Error fetching user first name:", error);
            }
        };
        const fetchUserLastName = async () => {
            try {
                const response = await getUserLastName(userID);
                setLastName(response);
            } catch (error) {
                console.error("Error fetching user last name:", error);
            }
        };
        fetchUserKpi();
        fetchUserFirstName();
        fetchUserLastName();
    }, [startDate, endDate]);

    if (loading) {
        return <>
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress />
                </Typography>
            </Container>
        </>;
    } else {
        return <>
            <TableRow key={userID}>
                <TableCell><Typography>{firstName} {lastName}</Typography></TableCell>
                <TableCell>
                    {booked && inquiries ? (
                    <KpiSingleBar salesMade={booked} totalInquiries={inquiries} />
                    ) : (
                    <Typography>Nothing To Show</Typography>
                    )}
                </TableCell>
                <TableCell>
                    <Typography>
                    {booked && inquiries ? (
                        ((booked / inquiries) * 100).toFixed(1)+"%"
                        ) : (
                        "N/A"
                    )}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Button variant="contained" color="primary" size="small" href={`/userKpi/${userID}`}>View</Button>
                </TableCell>
            </TableRow>
        </>;
    }    
}