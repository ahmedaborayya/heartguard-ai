import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'grey.50',
          py: 2
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;