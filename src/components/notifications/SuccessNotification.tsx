'use client';

import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Alert,
  AlertTitle,
  Slide,
  SlideProps,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

// Slide transition component
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export interface SuccessNotificationProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function SuccessNotification({
  open,
  onClose,
  title,
  message,
  duration = 4000,
  action,
}: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setIsVisible(true);
    }
  }, [open]);

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  };

  const handleActionClick = () => {
    if (action) {
      action.onClick();
      handleClose();
    }
  };

  return (
    <Snackbar
      open={isVisible}
      autoHideDuration={duration}
      onClose={handleClose}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{
        '& .MuiSnackbarContent-root': {
          padding: 0,
        },
      }}
    >
      <Alert
        severity="success"
        variant="filled"
        onClose={handleClose}
        icon={<CheckCircleIcon />}
        sx={{
          width: '100%',
          minWidth: 320,
          maxWidth: 500,
          backgroundColor: '#e8f5e8', // Light green background
          color: '#2e7d32', // Dark green text
          border: '1px solid #c8e6c9', // Light green border
          '& .MuiAlert-icon': {
            color: '#2e7d32', // Dark green icon
          },
          '& .MuiAlert-message': {
            width: '100%',
          },
          '& .MuiAlert-action': {
            paddingLeft: 1,
          },
          '& .MuiIconButton-root': {
            color: '#2e7d32', // Dark green close button
          },
        }}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* {action && (
              <Typography
                variant="body2"
                sx={{
                  color: '#2e7d32', // Dark green text
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  '&:hover': {
                    textDecoration: 'none',
                  },
                }}
                onClick={handleActionClick}
              >
                {action.label}
              </Typography>
            )} */}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
        }
      >
        <AlertTitle sx={{ fontWeight: 600, mb: 0.5 }}>
          {title}
        </AlertTitle>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
}

