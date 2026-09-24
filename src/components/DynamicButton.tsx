import React from 'react';
import { Button, ButtonProps, CircularProgress, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// Extended button props for our dynamic button
interface DynamicButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'text' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  loadingText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
  customStyle?: React.CSSProperties;
  responsive?: boolean;
}

const DynamicButton: React.FC<DynamicButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  loadingText = 'Loading...',
  startIcon,
  endIcon,
  onClick,
  disabled = false,
  children,
  customStyle,
  responsive = true,
  ...otherProps
}) => {
  const theme = useTheme();

  // Map our custom variants to Material-UI variants
  const getMuiVariant = (): ButtonProps['variant'] => {
    switch (variant) {
      case 'primary':
        return 'contained';
      case 'secondary':
        return 'outlined';
      case 'success':
        return 'contained';
      case 'warning':
        return 'contained';
      case 'error':
        return 'contained';
      case 'text':
        return 'text';
      case 'outlined':
        return 'outlined';
      default:
        return 'contained';
    }
  };

  // Map our custom variants to Material-UI colors
  const getMuiColor = (): ButtonProps['color'] => {
    switch (variant) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'text':
        return 'primary';
      case 'outlined':
        return 'primary';
      default:
        return 'primary';
    }
  };

  // Get MUI size
  const getMuiSize = (): ButtonProps['size'] => {
    return size;
  };

  // Custom styles based on variant
  const getCustomStyles = () => {
    const scentoraVariantStyles = {
      primary: {
        '&.MuiButton-containedPrimary': {
          backgroundColor: '#a85d2a',
          color: '#fffaf2',
          '&:hover': { backgroundColor: '#88461f' },
          '&.Mui-disabled': { backgroundColor: '#c9a58d', color: '#fffaf2' },
        },
      },
      secondary: {
        '&.MuiButton-outlinedSecondary': {
          borderColor: '#a85d2a',
          color: '#88461f',
          '&:hover': { borderColor: '#88461f', backgroundColor: 'rgba(168, 93, 42, 0.06)' },
          '&.Mui-disabled': { borderColor: '#d8c8bb', color: '#b6a79c' },
        },
      },
      outlined: {
        '&.MuiButton-outlinedPrimary': {
          borderColor: '#a85d2a',
          color: '#88461f',
          '&:hover': { borderColor: '#88461f', backgroundColor: 'rgba(168, 93, 42, 0.06)' },
          '&.Mui-disabled': { borderColor: '#d8c8bb', color: '#b6a79c' },
        },
      },
      text: {
        '&.MuiButton-textPrimary': {
          color: '#88461f',
          '&:hover': { backgroundColor: 'rgba(168, 93, 42, 0.08)' },
          '&.Mui-disabled': { color: '#b6a79c' },
        },
      },
    };

    const baseStyles = {
      borderRadius: 8,
      fontWeight: 600,
      textTransform: 'none',
      transition: 'all 0.2s ease-in-out',
      position: 'relative',
      overflow: 'hidden',
      ...(variant in scentoraVariantStyles
        ? scentoraVariantStyles[variant as keyof typeof scentoraVariantStyles]
        : {}),
      ...customStyle,
    };

    // Add responsive styles if enabled
    if (responsive) {
      return {
        ...baseStyles,
        // Desktop (lg and above)
        [theme.breakpoints.up('lg')]: {
          fontSize: size === 'large' ? '1.1rem' : size === 'small' ? '0.875rem' : '1rem',
          padding: size === 'large' ? '16px 32px' : size === 'small' ? '8px 16px' : '12px 24px',
          minHeight: size === 'large' ? 56 : size === 'small' ? 36 : 44,
        },
        // Tablet (md)
        [theme.breakpoints.between('md', 'lg')]: {
          fontSize: size === 'large' ? '1rem' : size === 'small' ? '0.8rem' : '0.9rem',
          padding: size === 'large' ? '14px 28px' : size === 'small' ? '7px 14px' : '11px 22px',
          minHeight: size === 'large' ? 52 : size === 'small' ? 34 : 42,
        },
        // Small tablet (sm)
        [theme.breakpoints.between('sm', 'md')]: {
          fontSize: size === 'large' ? '0.95rem' : size === 'small' ? '0.75rem' : '0.85rem',
          padding: size === 'large' ? '12px 24px' : size === 'small' ? '6px 12px' : '10px 20px',
          minHeight: size === 'large' ? 48 : size === 'small' ? 32 : 40,
        },
        // Mobile (xs)
        [theme.breakpoints.down('sm')]: {
          fontSize: size === 'large' ? '0.9rem' : size === 'small' ? '0.7rem' : '0.8rem',
          padding: size === 'large' ? '10px 20px' : size === 'small' ? '5px 10px' : '8px 16px',
          minHeight: size === 'large' ? 44 : size === 'small' ? 30 : 36,
        },
        // Extra small mobile
        [theme.breakpoints.down('xs')]: {
          fontSize: size === 'large' ? '0.85rem' : size === 'small' ? '0.65rem' : '0.75rem',
          padding: size === 'large' ? '8px 16px' : size === 'small' ? '4px 8px' : '6px 12px',
          minHeight: size === 'large' ? 40 : size === 'small' ? 28 : 32,
        },
      };
    }

    return baseStyles;
  };

  // Loading state content
  const getButtonContent = () => {
    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          '& .MuiCircularProgress-root': {
            [theme.breakpoints.up('lg')]: { fontSize: 18 },
            [theme.breakpoints.between('md', 'lg')]: { fontSize: 17 },
            [theme.breakpoints.between('sm', 'md')]: { fontSize: 16 },
            [theme.breakpoints.down('sm')]: { fontSize: 15 },
            [theme.breakpoints.down('xs')]: { fontSize: 14 },
          }
        }}>
          <CircularProgress size="inherit" color="inherit" />
          {loadingText}
        </Box>
      );
    }
    return children;
  };

  // Handle click with loading state
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!loading && !disabled && onClick) {
      onClick(event);
    }
  };

  return (
    <Button
      variant={getMuiVariant()}
      color={getMuiColor()}
      size={getMuiSize()}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={handleClick}
      startIcon={loading ? undefined : startIcon}
      endIcon={loading ? undefined : endIcon}
      sx={getCustomStyles()}
      {...otherProps}
    >
      {getButtonContent()}
    </Button>
  );
};

export default DynamicButton;
