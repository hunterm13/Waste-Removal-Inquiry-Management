import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, Button, Container, Switch } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon, LightMode, DarkMode } from "@mui/icons-material";
import { auth } from "../utils/firebaseConfig";
import Link from "next/link";
import { styled } from "@mui/system";
import { useRouter } from "next/router";

const CustomAppBar = styled(AppBar)({
    maxWidth: "1200px",
    borderRadius: "10px",
    margin: "16px auto 32px auto",

  });

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [theme, setTheme] = useState("dark");

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark");
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await auth.signOut();
        window.location.href = "/";
    };

    const handleLogin = () => {
        router.push("/login");
    };
    return (
        <CustomAppBar position="static">
            <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
                <Container>
                    <IconButton
                        edge="start"
                        aria-label="menu"
                        onClick={toggleMenu}
                        sx={{
                            "&:hover": {
                                color: "primary.main",
                            },
                        }}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Button variant="text" size='large' component={Link} href='/' sx={{
                                color: "white", padding: "0",
                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}>Company Name</Button>
                </Container>
                <Container sx={{ display: "flex", justifyContent: "flex-end" }}>
                    {user ? (
                        <Button variant="text" size='large' onClick={handleLogout}sx={{
                            color: "white", padding: "0",
                            "&:hover": {
                                color: "primary.main",
                            },}}>Logout</Button>
                    ) : (
                        <Button variant="text" size='large' onClick={handleLogin} sx={{
                            color: "white", padding: "0",
                            "&:hover": {
                                color: "primary.main",
                            },}}>Login</Button>
                    )}
                </Container>
            </Toolbar>
            <Drawer anchor="left" open={isMenuOpen} onClose={toggleMenu}>
                <Container sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%"}}>
                    <List sx={{ padding: "16px" }}>
                        <IconButton onClick={toggleMenu} sx={{
                            "&:hover": {
                                color: "primary.main",
                            },
                            width: "fit-content"
                        }}>
                            <CloseIcon/>
                        </IconButton>
                        <ListItem sx={{padding:"0 16px 0 0"}}>
                            <Button variant="text" component={Link} href="/employeeLanding" sx={{
                                color: "white",
                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}>Dashboard</Button>
                        </ListItem>
                        <ListItem sx={{padding:"0 16px 0 0"}}>
                            <Button variant="text" component={Link} href="/teamReports" sx={{
                                color: "white",
                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}>Team Reports</Button>
                        </ListItem>
                        <ListItem sx={{padding:"0 16px 0 0"}}>
                            <Button variant="text" component={Link} href="/userManagement" sx={{
                                color: "white",
                                "&:hover": {
                                    color: "primary.main",
                                },
                            }}>User Management</Button>
                        </ListItem>
                    </List>
                    <Container sx={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
                        <LightMode sx={{marginY:"auto"}}/>
                        <Switch
                            checked={theme === "dark"}
                            onChange={toggleTheme}
                            color="primary"
                            name="themeSwitch"
                            inputProps={{ "aria-label": "toggle theme" }}
                        />
                        <DarkMode sx={{marginY:"auto"}}/>
                    </Container>
                </Container>
            </Drawer>
        </CustomAppBar>
    );
};

export default Navbar;