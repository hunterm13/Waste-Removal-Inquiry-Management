import NewUserForm  from '../components/NewUserForm';
import { Container, Typography, Button } from '@mui/material';


export default function signUp() {
    return <>
        <Container maxWidth='lg'>
            <Typography variant="h4" component="h1" align="center">
                Create New User
            </Typography>
            <NewUserForm />
        </Container>
    </>
}