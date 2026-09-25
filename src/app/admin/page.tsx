'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import LoginPage from '../auth/login/page';
import Loader from '@/components/Loader/loader';
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
    return <Loader text="Preparing your Scentora workspace..." />;
  }

  if (isAuthenticated && user) {
    return ;
  }

  return <LoginPage />;
}
