import React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Button color="inherit" component={RouterLink} to="/">
            Home
          </Button>
          <Button color="inherit" component={RouterLink} to="/movies">
            Movies
          </Button>
          <Button color="inherit" component={RouterLink} to="/movies/add">
            Add Movie
          </Button>
          <Button color="inherit" component={RouterLink} to="/bookings">
            My Bookings
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
