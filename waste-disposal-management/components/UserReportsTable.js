import React, { use, useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Button, TablePagination, Container, MenuItem, TextField, Select, Menu, Checkbox, Typography, FormControlLabel} from '@mui/material';
import { getReportsByUserId } from '../utils/queries';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const UserReportsTable = ({ uid }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState('dateReported');
    const [sortDirection, setSortDirection] = useState('desc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('Inquiry Type');
    const [showOther, setShowOther] = useState(true);

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
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(0);
    };

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const redirectToReport = (reportID) => {
        window.location.href = `/report/${reportID}`;
    };

    const filteredReports = reports.filter((report) => {
        if (searchTerm.trim() === '') {
            return true;
        }
        switch (searchType) {
            case 'Inquiry Type':
                return report.service && report.service.toLowerCase().includes(searchTerm.toLowerCase());
            case 'City':
                return report.city && report.city.toLowerCase().includes(searchTerm.toLowerCase());
            case 'Contact Name':
                return report.contactName && report.contactName.toLowerCase().includes(searchTerm.toLowerCase());
            case 'Site Name':
                return report.siteName && report.siteName.toLowerCase().includes(searchTerm.toLowerCase());
            default:
                return true;
        }
    }).filter((report) => {
        if (!showOther && !report.service) {
            return false;
        }
        return true;
    });

    const sortedReports = filteredReports.sort((a, b) => {
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

    return <>
        <Container maxWidth="xl" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1rem 0', padding:'0' }}>
            <Container style={{padding:'0', marginBottom:'1rem',display:'flex', justifyContent:'start', gap:'1rem'}}>
                <TextField id="search" label='Search' size='sm' value={searchTerm} onChange={handleSearch} />
                <Select
                onChange={(event) => {
                    setSearchType(event.target.value);
                    setSearchTerm('');
                }}
                value={searchType}>
                    <MenuItem value="Inquiry Type">Inquiry Type</MenuItem>
                    <MenuItem value="City">City</MenuItem>
                    <MenuItem value="Contact Name">Contact Name</MenuItem>
                    <MenuItem value="Site Name">Site Name</MenuItem>
                </Select>
            </Container>
            <Container maxWidth="xl" style={{padding:'0', marginBottom:'1rem', display:'flex', justifyContent: 'end', alignItems: 'center'}}>
                <FormControlLabel control={<Checkbox checked={showOther} onChange={(event) => setShowOther(event.target.checked)} />} label='Show All Reports'/>
            </Container>
        </Container>
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{backgroundColor: '#333333'}}>
                    <TableRow>
                        <TableCell 
                            onClick={() => handleSort('service')}
                            style={{ 
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                                width: '13%',
                            }}>
                            Inquiry Type
                            {sortColumn === 'service' && (
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
                                '&:hover': {
                                    color: 'primary.main',
                                },
                            }}>
                            Report Date
                            {sortColumn === 'dateReported' && (
                                sortDirection === 'asc' ? <KeyboardArrowUp style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('city')}
                            style={{ 
                                borderLeft: '1px solid rgba(81,81,81,1)',
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                            }}>
                            City
                            {sortColumn === 'city' && (
                                sortDirection === 'asc' ? <KeyboardArrowUp style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('contactName')}
                            style={{ 
                                borderLeft: '1px solid rgba(81,81,81,1)',
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                            }}>
                            Contact Name
                            {sortColumn === 'contactName' && (
                                sortDirection === 'asc' ? <KeyboardArrowUp style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('deliveryDate')}
                            style={{ 
                                borderLeft: '1px solid rgba(81,81,81,1)',
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                            }}>
                            Delivery Date
                            {sortColumn === 'deliveryDate' && (
                                sortDirection === 'asc' ? <KeyboardArrowUp style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('siteName')}
                            style={{ 
                                borderLeft: '1px solid rgba(81,81,81,1)',
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                            }}>
                            Site Name
                            {sortColumn === 'siteName' && (
                                sortDirection === 'asc' ? <KeyboardArrowUp style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort('contactEmail')}
                            style={{ 
                                borderLeft: '1px solid rgba(81,81,81,1)',
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                            }}>
                            Contact Email
                            {sortColumn === 'contactEmail' && (
                                sortDirection === 'asc' ? <KeyboardArrowUp style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: 'middle', margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell 
                            style={{ 
                                borderLeft: '1px solid rgba(81,81,81,1)',
                                fontWeight: 'bold', 
                                fontSize: '1.5rem',
                                cursor: 'pointer',
                                verticalAlign: 'middle',
                                whiteSpace: 'nowrap',
                            }}>
                        </TableCell>
                        
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedReports
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((report) => {
                            console.log(report); // Log the report
                            return (
                                <TableRow key={report.id}>
                                    <TableCell>{report.service || report.reportType}</TableCell>
                                    <TableCell style={{ borderLeft: '1px solid rgba(81,81,81,1)' }}>{report.dateReported.toDate().toLocaleDateString()}</TableCell>
                                    <TableCell style={{ borderLeft: '1px solid rgba(81,81,81,1)' }}>{!report.service ? '---' : report.city}</TableCell>
                                    <TableCell style={{ borderLeft: '1px solid rgba(81,81,81,1)' }}>{!report.service ? '---' : report.contactName}</TableCell>
                                    <TableCell style={{ borderLeft: '1px solid rgba(81,81,81,1)' }}>{!report.service || !report.deliveryDate ? '---': report.deliveryDate}</TableCell>
                                    <TableCell style={{ borderLeft: '1px solid rgba(81,81,81,1)' }}>{!report.service ? '---' : report.siteName}</TableCell>
                                    <TableCell style={{ borderLeft: '1px solid rgba(81,81,81,1)' }}>{!report.service ? '---' : report.contactEmail}</TableCell>
                                    <TableCell style={{ borderLeft: '1px solid rgba(81,81,81,1)' }}>
                                        <Button variant='contained' onClick={() => redirectToReport(report.id)}>View</Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component="div"
                count={filteredReports.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    </>;
};

export default UserReportsTable;