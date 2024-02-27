import { useEffect, useState } from "react";
import { getAllUserID } from "../utils/queries";
import  KpiRow  from "./KpiRow";
import { Typography, CircularProgress, Table, TableContainer, TableRow, TableHead, TableCell, TableBody, Container } from "@mui/material";

export default function AllUserKpiTable () {
    const [loading, setLoading] = useState(true);
    const [userIDs, setUserIDs] = useState("");

    useEffect(() => {
        const fetchUserIDs = async () => {
            try {
                const response = await getAllUserID();
                setUserIDs(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user IDs:", error);
            }
        };
        fetchUserIDs();
    }, []);

    if (loading) {
        return <>
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress />
                </Typography>
            </Container>
        </>;
    }

    return<>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{width:"15%"}}>Name</TableCell>
                        <TableCell style={{width:"75%"}}>Conversions</TableCell>
                        <TableCell style={{width:"10%"}}></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userIDs.map(userID => <KpiRow key={userID} userID={userID} />)}
                </TableBody>
            </Table>
        </TableContainer>
    </>;

}