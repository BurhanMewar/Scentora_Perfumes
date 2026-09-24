'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import LoginPage from '../auth/login/page';
import { CircularProgress } from '@mui/material';
export default function Home() {
  
  const { isAuthenticated, user } = useAppSelector((state: any) => state.auth) as {
    isAuthenticated: boolean;
    user: any;
  };
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay to ensure auth state is properly loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <CircularProgress/>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return ;
  }

  return <LoginPage />;
}
