import { useState } from "react";
import { TextField, AlertTitle, Alert, Button, Select, FormGroup, FormControl, Checkbox, InputLabel, FormControlLabel, Container } from "@mui/material";
import { createNewUser } from "../utils/queries";

export default function NewUserForm () {
    const [newUser, setNewUser] = useState({
        email: "",
        admin: false,
        active: false,
        firstName: "",
        lastName: "",
    });
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");

    const handleChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        });
        console.log(newUser);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createNewUser(newUser, password);
            window.location.href = "/employeeLanding";
        } catch (error) {
            setError(error.message);
        }
    };

    return <>
        {error &&
            <Alert severity='error' sx={{ marginBottom: 2 }} onClose={() => setError("")}>
                <AlertTitle>{error}</AlertTitle>
            </Alert>
        }
        <form onSubmit={handleSubmit}>
            <Container maxWidth='md' style={{marginTop:"1rem", display:"flex", justifyContent:"center", gap:"1rem"}}>
                <TextField
                    name="firstName"
                    label="First Name"
                    value={newUser.firstName}
                    required
                    style={{width: "35%"}}
                    onChange={handleChange}
                />
                <TextField
                    name="lastName"
                    label="Last Name"
                    required
                    value={newUser.lastName}
                    style={{width: "35%"}}
                    onChange={handleChange}
                />
            </Container>
            <Container maxWidth='md' style={{marginTop:"1rem", display:"flex", justifyContent:"center", gap:"1rem"}}>
                <TextField
                    name="email"
                    label="Email"
                    required
                    type='email'
                    value={newUser.email}
                    style={{width: "35%"}}
                    onChange={handleChange}
                />
                <TextField
                    name="password"
                    label="Password"
                    required
                    type='password'
                    value={password}
                    style={{width: "35%"}}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Container>
            <Button variant='contained' style={{margin:"1rem auto", display: "block"}} type="submit">Create User</Button>
        </form>
    </>;

}