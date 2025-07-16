import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Movie Booking App' }) => {
  return (
    <>
      <Navbar title={title} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {title && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1">
              {title}
            </Typography>
          </Box>
        )}
        {children}
      </Container>
    </>
  );
};

export default Layout;
