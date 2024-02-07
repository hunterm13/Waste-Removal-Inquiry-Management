import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchReports } from '../utils/queries';

export default function AdminPage() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        // Fetch reports from utils
        const loadReports = async () => {
            try {
                const response = await fetchReports(); // Replace with your API endpoint
                const data = await response.json();
                setReports(data);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        loadReports();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Report ID</TableCell>
                        <TableCell>Report Name</TableCell>
                        <TableCell>Report Date</TableCell>
                        {/* Add more table headers as needed */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell>{report.id}</TableCell>
                            <TableCell>{report.name}</TableCell>
                            <TableCell>{report.date}</TableCell>
                            {/* Add more table cells based on your report data structure */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};