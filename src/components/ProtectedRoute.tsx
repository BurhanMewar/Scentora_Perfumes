'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';

interface Permission {
  module: number;
  permissionTaskName: string;
  parentId: number;
  permissionTaskId: number;
  canView: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
  permissionId: number;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  action?: 'view' | 'create' | 'update' | 'delete';
  moduleId?: number;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  permission, 
  action = 'view',
  moduleId,
  fallback
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useSelector((state: any) => state.auth);
  const [accessState, setAccessState] = useState<'loading' | 'granted' | 'denied'>('loading');

  // Check access - single effect with minimal dependencies
  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      // Wait for auth to complete
      if (isLoading) {
        return;
      }

      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        if (isMounted) {
          router.push('/auth/login');
        }
        return;
      }

      // No permission required - allow access
      if (!permission) {
        if (isMounted) {
          setAccessState('granted');
        }
        return;
      }

      // Fetch permissions
      try {
        const response = await fetch('/api/auth/get-permissions', {
          credentials: 'include'
        });

        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.permissions) {
            // Check if user has required permission
            const userPermission = data.permissions.find((p: Permission) => 
              p.permissionTaskName.toLowerCase() === permission.toLowerCase() ||
              (moduleId && p.module === moduleId)
            );

            if (!userPermission) {
              setAccessState('denied');
              return;
            }

            let hasPermission = false;
            switch (action) {
              case 'view': hasPermission = userPermission.canView; break;
              case 'create': hasPermission = userPermission.canCreate; break;
              case 'update': hasPermission = userPermission.canUpdate; break;
              case 'delete': hasPermission = userPermission.canDelete; break;
              default: hasPermission = userPermission.canView;
            }

            setAccessState(hasPermission ? 'granted' : 'denied');
          } else {
            setAccessState('denied');
          }
        } else {
          setAccessState('denied');
        }
      } catch (error) {
        console.error('Permission check failed:', error);
        if (isMounted) {
          setAccessState('denied');
        }
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, isLoading]); // Minimal dependencies

  // Show loading spinner
  // if (accessState === 'loading') {
  //   return (
  //     <></>
  //     // <Box 
  //     //   sx={{ 
  //     //     display: 'flex', 
  //     //     flexDirection: 'column',
  //     //     alignItems: 'center', 
  //     //     justifyContent: 'center', 
  //     //     minHeight: '200px',
  //     //     gap: 2
  //     //   }}
  //     // >
  //     //   <CircularProgress size={40} />
  //     // </Box>
  //   );
  // }

  // Show fallback or redirect if no access
  if (accessState === 'denied') {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    router.push('/not-permitted');
    return null;
  }

  // Render children if user has access
  return <>{children}</>;
};

export default ProtectedRoute;