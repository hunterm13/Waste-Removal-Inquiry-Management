import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, Button } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import Link from 'next/link';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    edge="start"
                    aria-label="menu"
                    onClick={toggleMenu}
                    sx={{
                        '&:hover': {
                            color: 'primary.main',
                        },
                    }}
                >
                    <MenuIcon />
                </IconButton>
                <Button variant="text" size='large' component={Link} href='/' sx={{
                            color: 'white', padding: '0',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}>Company Name</Button>
            </Toolbar>
            <Drawer anchor="left" open={isMenuOpen} onClose={toggleMenu} >
                <List sx={{ padding: '16px' }}>
                    <IconButton onClick={toggleMenu} sx={{
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}>
                        <CloseIcon/>
                    </IconButton>
                    <ListItem sx={{padding:'0 16px 0 0'}}>
                        <Button variant="text" sx={{
                            color: 'white',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}>Menu Option 1</Button>
                    </ListItem>
                    <ListItem sx={{padding:'0 16px 0 0'}}>
                        <Button variant="text" sx={{
                            color: 'white',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}>Menu Option 2</Button>
                    </ListItem>
                    <ListItem sx={{padding:'0 16px 0 0'}}>
                        <Button variant="text" sx={{
                            color: 'white',
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}>Menu Option 3</Button>
                    </ListItem>
                </List>
            </Drawer>
        </AppBar>
    );
};

export default Navbar;