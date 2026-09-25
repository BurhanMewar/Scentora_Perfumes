'use client';

import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import theme from '../theme/theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const pathname = usePathname();
  const muiAdminRoutes = ['/auth', '/user', '/role', '/permission', '/menu', '/appsetting'];
  const needsMuiTheme = muiAdminRoutes.some(
    (route) => pathname === route || pathname?.startsWith(`${route}/`),
  ) || (pathname?.startsWith('/admin') && !pathname.startsWith('/admin/banner'));

  // Keep the shared Scentora palette available to reusable MUI components,
  // including dropdowns used on storefront pages. CssBaseline stays limited
  // to the admin screens so it does not alter the storefront's global reset.
  if (!needsMuiTheme) {
    return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
  }

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

