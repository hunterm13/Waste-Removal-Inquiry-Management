import React, { useEffect, useState } from "react";
import { TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Container, Typography, Button, Select, MenuItem } from "@mui/material";
import { getAdminStatus, fetchUsers, enableUserByID, disableUserByID, fixHowHeard, updateReportsWithUserName, updateReportsWithService, fixPhoneNumbers, listAllSiteNumbers, fixLeadChannels } from "../utils/queries";
import { auth } from "../utils/firebaseConfig";

export default function AdminPage() {
    const [users, setUsers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthInitialized, setIsAuthInitialized] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(async user => {
            if (!auth.currentUser) {
                window.location.href = "/login";
            }    
            setIsAuthInitialized(true);
            if (user) {
                const adminStatus = await getAdminStatus(user.uid);
                const userQuery = await fetchUsers();
                setUsers(userQuery);
                setIsAdmin(adminStatus);
                setLoading(false);
                console.log(userQuery);
            }
        });
        return () => unregisterAuthObserver(); 
    }, []);

    const handleEnable = (userID) => {
        const confirmEnable = window.confirm("Are you sure you want to enable this user?");
        if (confirmEnable) {
            enableUserByID(userID);
            const updatedUsers = users.map(user => {
                if (user.id === userID) {
                    user.active = true;
                }
                return user;
            }
            );
            setUsers(updatedUsers);
        }
    };

    const handleDisable = (userID, admin) => {
        if(admin){
            alert("You cannot disable an admin user");
        } else {
            const confirmDisable = window.confirm("Are you sure you want to disable this user?");
            if (confirmDisable) {
                disableUserByID(userID);
                const updatedUsers = users.map(user => {
                    if (user.id === userID) {
                        user.active = false;
                    }
                    return user;
                }
                );
                setUsers(updatedUsers);
            }
        }
    };

    const fixThings = async () => {
        //fixHowHeard();
        //updateReportsWithUserName();
        //updateReportsWithService();
        //fixPhoneNumbers();
        //console.log(listAllSiteNumbers())
        //fixLeadChannels();
    };

    if (!isAuthInitialized || loading) {
        return (
            <Container maxWidth="xl" align='center'>
                <CircularProgress />
            </Container>
        );
    } else if (isAdmin) {
        return (
                <Container maxWidth="lg" style={{padding:0}}>
                    <Typography variant="h2" style={{marginBottom:"1rem"}} component="h1" align="center">
                        User Management
                    </Typography>
                    <Container style={{marginBottom:"1rem", display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                        <Container style={{padding:0}}>
                            <TextField label="Search" variant="outlined" />
                            <Select style={{marginLeft:"1rem"}}>
                                <MenuItem value='firstName'>First Name</MenuItem>
                                <MenuItem value='lastName'>Last Name</MenuItem>
                                <MenuItem value='email'>Email</MenuItem>                                
                            </Select>
                        </Container>
                        <Button 
                            variant='contained'
                            color='primary'
                            style={{ textWrap:"nowrap", height:"fit-content" }}
                            href='/newUser'
                        >
                            Add User
                        </Button>
                    </Container>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{backgroundColor: "#333333"}}>
                                <TableRow>
                                    <TableCell>First Name</TableCell>
                                    <TableCell>Last Name</TableCell>
                                    <TableCell style={{width:"10%"}}>Active</TableCell>
                                    <TableCell style={{width:"10%"}}>Admin</TableCell>
                                    <TableCell style={{width:"10%"}}></TableCell>
                                    <TableCell style={{width:"10%"}}></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.firstName}</TableCell>
                                        <TableCell>{user.lastName}</TableCell>
                                        <TableCell>
                                            <input type="checkbox" checked={user.active} disabled/>
                                        </TableCell>
                                        <TableCell>
                                            <input type="checkbox" checked={user.admin} disabled/>
                                        </TableCell>
                                        <TableCell style={{width:"10%"}}>
                                            <Button variant="contained" color="primary" href={`/user/${user.id}`}>Edit</Button>
                                        </TableCell>
                                        <TableCell style={{width:"10%"}}>
                                            {!user.active ? <Button variant="contained" color="tertiary" onClick={() => handleEnable(user.id)}>Enable</Button>:
                                             <Button variant="contained" color="secondary" onClick={() => handleDisable(user.id, user.admin)} >Disable</Button>}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>                    
                    {/* <Button onClick={fixThings}>fix broken thing</Button> */}
                </Container>
        );
    } else {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    You are not authorized to view this page.
                </Typography>
                <Typography variant="h5" component="h1" align="center">
                    If you believe this is an error, please contact your system administrator.
                </Typography>
            </Container>
        );        
    }
};