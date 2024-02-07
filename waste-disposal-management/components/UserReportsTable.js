import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { getReportsByUserId } from '../utils/queries';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const UserReportsTable = ({ uid }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState('dateReported');
    const [sortDirection, setSortDirection] = useState('asc');

    useEffect(() => {
        const fetchUserReports = async () => {
            try {
                setLoading(true);
                const userReports = await getReportsByUserId(uid);
                setReports(userReports);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user reports:', error);
                setLoading(false);
            }
        };

        fetchUserReports();
    }, [uid]);

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const sortedReports = reports.sort((a, b) => {
        if (sortColumn) {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];
            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
        }
        return 0;
    });

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow style={{backgroundColor: '#333'}}>
                        <TableCell 
                            onClick={() => handleSort('inquiryType')}
                            style={{ 
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                                width: '20%',
                            }}
                            className={`hover-effect ${sortColumn === 'inquiryType' ? 'active' : ''}`}
                        >
                            Inquiry Type
                            {sortColumn === 'inquiryType' && (
                                sortDirection === 'asc' ? <KeyboardArrowUp style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell 
                            onClick={() => handleSort('notes')}
                            style={{ 
                                borderLeft: '1px solid rgba(81,81,81,1)',
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                                width: '40%',
                            }}
                            className={`hover-effect ${sortColumn === 'notes' ? 'active' : ''}`}
                        >
                            Notes
                            {sortColumn === 'notes' && (
                                sortDirection === 'asc' ? <KeyboardArrowUp style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell 
                            onClick={() => handleSort('dateReported')}
                            style={{ 
                                borderLeft: '1px solid rgba(81,81,81,1)',
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                                width: '15%',
                            }}
                            className={`hover-effect ${sortColumn === 'dateReported' ? 'active' : ''}`}
                        >
                            Report Date
                            {sortColumn === 'dateReported' && (
                                sortDirection === 'asc' ? <KeyboardArrowUp style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedReports.map((report) => (
                        <TableRow key={report.id}>
                            <TableCell>{report.inquiryType}</TableCell>
                            <TableCell style={{borderLeft: '1px solid rgba(81,81,81,1)',}}>{report.notes}</TableCell>
                            <TableCell style={{borderLeft: '1px solid rgba(81,81,81,1)',}}>{report.dateReported.toDate().toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UserReportsTable;