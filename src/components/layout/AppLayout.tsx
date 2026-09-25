'use client';

import {
  Box,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Toolbar,
  IconButton,
} from '@mui/material';
import { useState, useEffect } from 'react';
import Header from '@/components/shared/Header';
import Sidebar from './Sidebar';
import Footer from '@/components/shared/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  onThemeToggle?: () => void;
  isDarkMode?: boolean;
}

const drawerWidth = 280;

export default function AppLayout({ children, onThemeToggle, isDarkMode = false }: AppLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const currentDrawerWidth = sidebarCollapsed ? 80 : drawerWidth;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header variant="admin"
        onMenuClick={handleSidebarToggle}
        onThemeToggle={onThemeToggle}
        isDarkMode={isDarkMode}
        sidebarOpen={sidebarOpen}
        onSidebarCollapse={handleSidebarCollapse}
        sidebarCollapsed={sidebarCollapsed}
      />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        variant={isMobile ? 'temporary' : 'permanent'}
        collapsed={sidebarCollapsed}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          minHeight: 0,
          overflow: 'hidden',
          width: { 
            xs: '100%', 
            md: `calc(100% - ${currentDrawerWidth}px)` 
          },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Toolbar to push content below fixed header */}
        <Toolbar />
        
        {/* Content Area */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
        }}>
          {/* Page Content */}
          <Box sx={{ 
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            p: { xs: 2, md: 3 },
            backgroundColor: 'background.default',
          }}>
            {children}
          </Box>
          
          {/* Footer */}
          <Footer variant="admin" />
        </Box>
      </Box>
    </Box>
  );
}

