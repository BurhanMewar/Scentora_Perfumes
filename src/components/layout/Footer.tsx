'use client';

import {
  Box,
  Typography,
  useTheme,
} from '@mui/material';

export default function Footer() {
  const theme = useTheme();
  const CurrentYear = new Date().getFullYear();
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: 'auto',
        py: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {CurrentYear} Scentora. All rights reserved.
      </Typography>
    </Box>
  );
}

