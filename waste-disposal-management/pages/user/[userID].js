import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { Alert, FormControl, AlertTitle, CircularProgress, Container, Button, Typography, TextField, FormControlLabel, Switch, InputLabel } from "@mui/material";
import { getUserDetails, getAdminStatus, deleteUserByID, updateUserByID } from "../../utils/queries";
import { auth } from "../../utils/firebaseConfig";

export default function User() {
    const router = useRouter();
    const { userID } = router.query;
    const [ loading, setLoading ] = useState(true);
    const [ user, setUser ] = useState(null);
    const [ isAuthInitialized, setIsAuthInitialized ] = useState(false);
    const [ isAdmin, setIsAdmin ] = useState(false);
    const [ error, setError ] = useState("");
    const [ editing, setEditing ] = useState(false);
    const [ isFormDirty, setIsFormDirty ] = useState(false);
    const [initialUser, setInitialUser] = useState(null);
    const isInitialLoad = useRef(true);
    const [errorTimeout, setErrorTimeout] = useState(null);

    useEffect(() => {
        if (error) {
            setErrorTimeout(setTimeout(() => setError(""), 5000)); // Set error message to disappear after 5 seconds
        }
        return () => clearTimeout(errorTimeout); // Clear timeout when component unmounts
    }, [error]);

    useEffect(() => {
        const unregisterAuthObserver = auth.onAuthStateChanged(async user => {
            if (!auth.currentUser) {
                window.location.href = "/login";
            }    
            setIsAuthInitialized(true);
            if (user) {
                const adminStatus = await getAdminStatus(user.uid);
                setIsAdmin(adminStatus);                
            }
        });
        return () => unregisterAuthObserver(); 
    }, []);
    
    useEffect(() => {
        if (isAuthInitialized) {
            const fetchUser = async () => {
                try {
                    const userData = await getUserDetails(userID);
                    setUser(userData);
                    setInitialUser(userData); // Set initial user data
                    setLoading(false);
                    isInitialLoad.current = false; // Set to false after data is loaded
                } catch (error) {
                    
                }
            };
            fetchUser();
        }
    }, [isAuthInitialized, userID]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: value }); // Update user state with new value
        setIsFormDirty(true); // Update isFormDirty state
    };

    const handleSave = async () => {
        if (editing && isFormDirty) {
            const confirmSave = window.confirm("Are you sure you want to save changes?");
            if (confirmSave) {
                try {
                    // Save changes
                    await updateUserByID(userID, user);
                    setEditing(false);
                    setIsFormDirty(false);
                    setError("");
                } catch (error) {
                    setError("Error saving changes: " + error.message);
                }
            }
        } else {
            setEditing(!editing);
        }
    };
    

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete the user? This action cannot be undone.");
        if (confirmDelete) {
            try{
                await deleteUserByID(userID);
                window.location.href = "/userManagement";
            } catch (error) {
                setError("Error deleting user");
                console.log(error);
            }
        }
    };

    const handleEdit = () => {
        if (editing && isFormDirty) {
            const confirmCancel = window.confirm("Are you sure you want to cancel? Any unsaved changes will be lost.");
            if (confirmCancel) {
                setUser(initialUser); // Reset user data to initial state
                setIsFormDirty(false); // Reset isFormDirty state to false
                setEditing(false);
            }
        } else if (!editing) {
            setEditing(true);
        } else {
            setEditing(false);
        }
    };

    if (!isAuthInitialized || loading) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    <CircularProgress/>
                </Typography>
            </Container>
        );
    }

    if (!isAdmin) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    You are not authorized to view this page.
                </Typography>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container maxWidth="xl">
                <Typography variant="h2" component="h1" align="center">
                    User not found.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <div style={{minHeight:"70px"}}>
            {error && 
                <Alert severity='error' sx={{ marginBottom: 2 }}>
                    <AlertTitle>{error}</AlertTitle>
                </Alert>}
                </div>
            <Typography variant="h2" component="h1" align="center">
                User Details
            </Typography>
            <Typography variant="h3" component="h2" align="right">
                <Button variant="contained" color="error" disabled onClick={handleDelete}>Delete User</Button>
            </Typography>
            {editing ? (
                <form style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center", marginBottom: "2rem" }}>
                    <FormControl>
                        <TextField
                            label="First Name"
                            name="firstName" // Add name attribute
                            value={user.firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            label="Last Name"
                            name="lastName" // Add name attribute
                            value={user.lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </FormControl>
                </div>
                <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
                    <FormControlLabel
                        control={<Switch checked={user.active} onChange={(event) => {
                            setUser({ ...user, active: event.target.checked }); // Update user state with new value
                            setIsFormDirty(true); // Update isFormDirty state
                        }} />}
                        label="Active"
                    />
                    <FormControlLabel
                        control={<Switch checked={user.admin} onChange={(event) => {
                            setUser({ ...user, admin: event.target.checked }); // Update user state with new value
                            setIsFormDirty(true); // Update isFormDirty state
                        }} />}
                        label="Admin"
                    />
                </div>
            </form>
            ) : (
                <Container style={{padding:"0", marginTop:"2rem"}}>
                    <Typography variant="h5" component="h3" style={{marginTop:"1rem"}}>
                        First Name: {user.firstName}
                    </Typography>
                    <Typography variant="h5" component="h3" style={{marginTop:"1rem"}}>
                        Last Name: {user.lastName}
                    </Typography>
                    <Typography variant="h5" component="h3" style={{marginTop:"1rem"}}>
                        Active: {user.active ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="h5" component="h3" style={{marginTop:"1rem"}}>
                        Admin: {user.admin ? "Yes" : "No"}
                    </Typography>
                </Container>
            )}
            <Container style={{display:"flex", padding:"0", justifyContent:"space-between", marginTop:"2rem"}}>
                <Button variant="contained" href="/userManagement">Back to User Management</Button>
                <Container style={{margin:"0", width:"fit-content", display:"flex", gap:"1rem"}}>
                    <Button variant="contained" color={!editing ? "primary" : "secondary"} onClick={handleEdit}>
                        {!editing ? "Edit" : "Cancel"}
                    </Button>
                    {editing && <Button variant="contained" disabled={!isFormDirty} color="tertiary" onClick={handleSave}>Save</Button>}
                </Container>
            </Container>
        </Container>
    );

}

