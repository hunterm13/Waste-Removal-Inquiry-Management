import React, { use, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, Tooltip, TableHead, TableRow, Paper, CircularProgress, Button, TablePagination, Container, MenuItem, TextField, Select, Menu, Checkbox, Typography, FormControlLabel} from "@mui/material";
import { getUserReportsForLanding, getReportsByMonth } from "../utils/queries";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const UserReportsTable = ({ uid }) => {
    const [reports, setReports] = useState([]);
    const [initialReportData, setInitialReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortColumn, setSortColumn] = useState("dateReported");
    const [sortDirection, setSortDirection] = useState("desc");
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchType, setSearchType] = useState("Email");
    const [showOther, setShowOther] = useState(true);
    const [searchMonth, setSearchMonth] = useState();   
    const [customData, setCustomData] = useState();    

    useEffect(() => {
        const fetchUserReports = async () => {
            try {
                setLoading(true);
                const userReports = await getUserReportsForLanding(uid);
                setReports(userReports);
                setInitialReportData(userReports);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user reports:", error);
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
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const submitExtendedSearch = async () => {
        await getReportsByMonth(searchMonth).then((data) => {
            const filteredReports = data.filter((report) => {
                if (searchTerm.trim() === "") {
                    return true;
                }
                switch (searchType) {
                    case "Inquiry Type":
                        return report.service && report.service.toLowerCase().includes(searchTerm.toLowerCase());
                    case "Email":
                        return report.contactEmail && report.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
                    case "Contact Name":
                        return report.contactName && report.contactName.toLowerCase().includes(searchTerm.toLowerCase());
                    case "Site Name":
                        return report.siteName && report.siteName.toLowerCase().includes(searchTerm.toLowerCase());
                    case "Contact Number":
                        return report.siteNumber && report.siteNumber.replace(/\D/g, "").includes(searchTerm.replace(/\D/g, ""));
                    default:
                        return true;
                }
            });
            setReports(filteredReports);
        });
        setCustomData(true);
    };
    
    const resetSearch = () => {
        setReports(initialReportData);
        setCustomData(false);
        setSearchTerm("");
        setSearchMonth(null);
    };

    const redirectToReport = (reportID) => {
        window.location.href = `/report/${reportID}`;
    };

    const filteredReports = reports.filter((report) => {
        if (searchTerm.trim() === "") {
            return true;
        }
        switch (searchType) {
            case "Inquiry Type":
                return report.service && report.service.toLowerCase().includes(searchTerm.toLowerCase());
            case "Email":
                return report.contactEmail && report.contactEmail.toLowerCase().includes(searchTerm.toLowerCase());
            case "Contact Name":
                return report.contactName && report.contactName.toLowerCase().includes(searchTerm.toLowerCase());
            case "Site Name":
                return report.siteName && report.siteName.toLowerCase().includes(searchTerm.toLowerCase());
            case "Contact Number":
                return report.siteNumber && report.siteNumber.replace(/\D/g, "").includes(searchTerm.replace(/\D/g, ""));
            default:
                return true;
        }
    }).filter((report) => {
        if (!showOther && (report.service == "Other" || report.reportType == "Removal" || report.service == "Front Load" || report.reportType == "Swap")) {
            return false;
        }
        return true;
    });

    const sortedReports = filteredReports.sort((a, b) => {
        if (sortColumn) {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];
            if (aValue < bValue) {
                return sortDirection === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === "asc" ? 1 : -1;
            }
        }
        return 0;
    });

    if (loading) {
        return <CircularProgress />;
    }

    return <>
        <Container maxWidth="xl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "1rem 0", padding:"0" }}>
            <Container style={{padding:"0", marginBottom:"1rem",display:"flex", justifyContent:"start", gap:"1rem"}}>
            <Select
                    style={{height:"100%", width:"200px"}}
                    onChange={(event) => {
                        setSearchType(event.target.value);
                        setSearchTerm("");
                    }}
                    value={searchType}
                >
                    <MenuItem value="Email">Email</MenuItem>
                    <MenuItem value="Inquiry Type">Inquiry Type</MenuItem>
                    <MenuItem value="Contact Name">Contact Name</MenuItem>
                    <MenuItem value="Site Name">Site Name</MenuItem>
                    <MenuItem value="Contact Number">Site Number</MenuItem>
                </Select>
                <TextField id="search" label='Search' size='sm'style={{width:"200px"}}  value={searchTerm} onChange={handleSearch} />
                <Container style={{padding:"0", width:"200px"}}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker                        
                            label="Search Month"
                            value={!searchMonth ? null : searchMonth}
                            onChange={(newDate) => {setSearchMonth(newDate);}}
                            views={["month", "year"]} 
                            disableFuture
                        />
                    </LocalizationProvider>
                </Container>
                <Button variant="contained" style={{padding:"0", width:"200px"}} disabled={!searchMonth || !searchTerm} onClick={submitExtendedSearch}>Search All Reports</Button>
                {customData && <Button variant="contained" color="secondary" style={{padding:"0", width:"160px"}} onClick={resetSearch}>Clear Search</Button>}
            </Container>
            <Container maxWidth="xl" style={{padding:"0", marginBottom:"1rem", display:"flex", justifyContent: "end", alignItems: "center"}}>
                <FormControlLabel control={<Checkbox checked={showOther} onChange={(event) => setShowOther(event.target.checked)} />} label='Show All Reports'/>
            </Container>
        </Container>
        <TableContainer component={Paper}>
            <Table>
                <TableHead sx={{backgroundColor: "#333333"}}>
                    <TableRow>
                        <TableCell 
                            onClick={() => handleSort("service")}
                            style={{ 
                                fontWeight: "bold", 
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                                width: "13%",
                            }}>
                            Inquiry Type
                            {sortColumn === "service" && (
                                sortDirection === "asc" ? <KeyboardArrowUp style={{ verticalAlign: "middle", margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: "middle", margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell 
                            onClick={() => handleSort("dateReported")}
                            style={{ 
                                borderLeft: "1px solid rgba(81,81,81,1)",
                                fontWeight: "bold", 
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                                width: "15%",
                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}>
                            Report Date
                            {sortColumn === "dateReported" && (
                                sortDirection === "asc" ? <KeyboardArrowUp style={{ verticalAlign: "middle", margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: "middle", margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort("city")}
                            style={{ 
                                borderLeft: "1px solid rgba(81,81,81,1)",
                                fontWeight: "bold", 
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                            }}>
                            City
                            {sortColumn === "city" && (
                                sortDirection === "asc" ? <KeyboardArrowUp style={{ verticalAlign: "middle", margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: "middle", margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort("contactName")}
                            style={{ 
                                borderLeft: "1px solid rgba(81,81,81,1)",
                                fontWeight: "bold", 
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                            }}>
                            Contact Name
                            {sortColumn === "contactName" && (
                                sortDirection === "asc" ? <KeyboardArrowUp style={{ verticalAlign: "middle", margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: "middle", margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell
                            style={{ 
                                borderLeft: "1px solid rgba(81,81,81,1)",
                                fontWeight: "bold", 
                                fontSize: "1.5rem",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                            }}>
                            <Tooltip title="Not Sortable" placement="top">
                                Contact Number
                            </Tooltip>
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort("siteName")}
                            style={{ 
                                borderLeft: "1px solid rgba(81,81,81,1)",
                                fontWeight: "bold", 
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                            }}>
                            Business Name
                            {sortColumn === "siteName" && (
                                sortDirection === "asc" ? <KeyboardArrowUp style={{ verticalAlign: "middle", margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: "middle", margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell
                            onClick={() => handleSort("contactEmail")}
                            style={{ 
                                borderLeft: "1px solid rgba(81,81,81,1)",
                                fontWeight: "bold", 
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                            }}>
                            Contact Email
                            {sortColumn === "contactEmail" && (
                                sortDirection === "asc" ? <KeyboardArrowUp style={{ verticalAlign: "middle", margin: 0, padding: 0 }} /> : <KeyboardArrowDown style={{ verticalAlign: "middle", margin: 0, padding: 0 }} />
                            )}
                        </TableCell>
                        <TableCell 
                            style={{ 
                                borderLeft: "1px solid rgba(81,81,81,1)",
                                fontWeight: "bold", 
                                fontSize: "1.5rem",
                                cursor: "pointer",
                                verticalAlign: "middle",
                                whiteSpace: "nowrap",
                            }}>
                        </TableCell>
                        
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedReports.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={8}>No reports found.</TableCell>
                        </TableRow>
                    )}
                    {sortedReports
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((report) => {
                            return (
                                <TableRow key={report.id}>
                                    <TableCell>{report.service || report.reportType}</TableCell>
                                    <TableCell style={{ borderLeft: "1px solid rgba(81,81,81,1)" }}>{report.dateReported.toDate().toLocaleDateString()}</TableCell>
                                    <TableCell style={{ borderLeft: "1px solid rgba(81,81,81,1)" }}>{!report.city ? "---" : report.city}</TableCell>
                                    <TableCell style={{ borderLeft: "1px solid rgba(81,81,81,1)" }}>{!report.contactName ? "---" : report.contactName}</TableCell>
                                    <TableCell style={{ borderLeft: "1px solid rgba(81,81,81,1)" }}>{!report.service || !report.siteNumber ? "---": report.siteNumber}</TableCell>
                                    <TableCell style={{ borderLeft: "1px solid rgba(81,81,81,1)" }}>{!report.siteName ? "---" : report.siteName}</TableCell>
                                    <TableCell style={{ borderLeft: "1px solid rgba(81,81,81,1)" }}>{!report.contactEmail ? "---" : report.contactEmail}</TableCell>
                                    <TableCell style={{ borderLeft: "1px solid rgba(81,81,81,1)" }}>
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