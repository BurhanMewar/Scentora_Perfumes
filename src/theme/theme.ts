import { createTheme, ThemeOptions } from '@mui/material/styles';

// Custom breakpoints for better responsive design
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    wide: 1440,
  },
};

// Custom spacing for consistent layout
const spacing = 8;

// Shared Scentora palette for MUI components across the admin experience.
const palette = {
  primary: {
    main: '#a85d2a',
    light: '#c9854f',
    dark: '#88461f',
    contrastText: '#fffaf2',
  },
  secondary: {
    main: '#d29a4a',
    light: '#e7bd78',
    dark: '#a8752f',
    contrastText: '#28190f',
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#dc2626',
    contrastText: '#ffffff',
  },
  background: {
    default: '#f7f0e2',
    paper: '#fffdf8',
  },
  text: {
    primary: '#2a1b13',
    secondary: '#75685e',
    disabled: '#a99a8c',
  },
  divider: '#e5d9c9',
  action: {
    hover: 'rgba(168, 93, 42, 0.06)',
    selected: 'rgba(168, 93, 42, 0.12)',
    active: 'rgba(168, 93, 42, 0.18)',
  },
  common: {
    white: '#ffffff',
    black: '#000000',
  },
  grey: {
    50: '#fbf7ef',
    100: '#f6efe4',
    200: '#e5d9c9',
    300: '#cbb9a5',
    400: '#a99a8c',
    500: '#75685e',
    600: '#5f5045',
    700: '#49382d',
    800: '#35271e',
    900: '#241811',
  },
};

// Typography configuration inspired by the image
const typography = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  h1: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '2.375rem', // 38px
    fontWeight: 700,
    lineHeight: 1.2,
    color: palette.text.primary,
    letterSpacing: '-0.025em',
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: '2.125rem',
    },
    [`@media (max-width:${breakpoints.values.sm}px)`]: {
      fontSize: '1.875rem',
    },
  },
  h2: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '2rem', // 32px
    fontWeight: 600,
    lineHeight: 1.3,
    color: palette.text.primary,
    letterSpacing: '-0.025em',
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: '1.875rem',
    },
    [`@media (max-width:${breakpoints.values.sm}px)`]: {
      fontSize: '1.625rem',
    },
  },
  h3: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '1.625rem', // 26px
    fontWeight: 600,
    lineHeight: 1.4,
    color: palette.text.primary,
    letterSpacing: '-0.025em',
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: '1.375rem',
    },
    [`@media (max-width:${breakpoints.values.sm}px)`]: {
      fontSize: '1.25rem',
    },
  },
  h4: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '1.375rem', // 22px
    fontWeight: 600,
    lineHeight: 1.4,
    color: palette.text.primary,
    letterSpacing: '-0.025em',
    [`@media (max-width:${breakpoints.values.md}px)`]: {
      fontSize: '1.25rem',
    },
    [`@media (max-width:${breakpoints.values.sm}px)`]: {
      fontSize: '1.125rem',
    },
  },
  h5: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '1.25rem', // 20px
    fontWeight: 600,
    lineHeight: 1.5,
    color: palette.text.primary,
    letterSpacing: '-0.025em',
    [`@media (max-width:${breakpoints.values.sm}px)`]: {
      fontSize: '1.125rem',
    },
  },
  h6: {
    fontFamily: 'Georgia, "Times New Roman", serif',
    fontSize: '1.125rem', // 18px
    fontWeight: 600,
    lineHeight: 1.5,
    color: palette.text.primary,
    letterSpacing: '-0.025em',
    [`@media (max-width:${breakpoints.values.sm}px)`]: {
      fontSize: '1rem',
    },
  },
  body1: {
    fontSize: '1rem', // 16px
    lineHeight: 1.6,
    color: palette.text.primary,
    fontWeight: 400,
    [`@media (max-width:${breakpoints.values.sm}px)`]: {
      fontSize: '0.95rem',
    },
  },
  body2: {
    fontSize: '0.875rem', // 14px
    lineHeight: 1.6,
    color: palette.text.secondary,
    fontWeight: 400,
    [`@media (max-width:${breakpoints.values.sm}px)`]: {
      fontSize: '0.8rem',
    },
  },
  button: {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '1rem',
    letterSpacing: '0.025em',
  },
  caption: {
    color: palette.text.secondary,
    fontSize: '0.875rem',
    fontWeight: 400,
  },
  overline: {
    color: palette.text.secondary,
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};

// Component overrides for consistent styling
const components = {
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: palette.background.paper,
        borderRadius: 8,
        boxShadow: '0 8px 24px rgba(56, 36, 20, 0.06)',
        border: '1px solid #f2eadf',
        '&:hover': {
          boxShadow: '0 12px 28px rgba(56, 36, 20, 0.09)',
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
        borderRadius: 8,
        border: '1px solid #f2eadf',
      },
      outlined: {
        borderColor: '#e5d9c9',
      },
      elevation1: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
      },
      elevation2: {
        boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 6,
          fontSize: '0.875rem',
          '& fieldset': {
            borderColor: '#e5d9c9',
            borderWidth: '1px',
          },
          '&:hover fieldset': {
            borderColor: '#cbb9a5',
          },
          '&.Mui-focused fieldset': {
            borderColor: palette.primary.main,
            borderWidth: '2px',
          },
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
          color: palette.text.secondary,
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: palette.background.paper,
        color: palette.text.primary,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: `1px solid ${palette.divider}`,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: palette.background.paper,
        borderRight: `1px solid ${palette.divider}`,
        boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid #f2eadf',
        padding: '12px 16px',
        fontSize: '1rem',
        color: palette.text.primary,
      },
      head: {
        backgroundColor: '#fbf7ef',
        fontWeight: 600,
        color: palette.text.primary,
        fontSize: '1rem',
        borderBottom: '2px solid #e5d9c9',
      },
      body: {
        fontSize: '1rem',
        color: palette.text.primary,
      },
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: {
        border: '1px solid #e5d9c9',
        borderRadius: 8,
        overflow: 'hidden',
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: {
        backgroundColor: '#fbf7ef',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        fontSize: '0.75rem',
        fontWeight: 500,
        height: '24px',
      },
      sizeSmall: {
        fontSize: '0.7rem',
        height: '20px',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 500,
        fontSize: '1rem',
        minHeight: '48px',
        '&.Mui-selected': {
          color: palette.primary.main,
          fontWeight: 600,
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        backgroundColor: palette.primary.main,
        height: '2px',
      },
    },
  },
  MuiListItemButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        margin: '2px 8px',
        '&:hover': {
          backgroundColor: palette.action.hover,
        },
        '&.Mui-selected': {
          backgroundColor: palette.action.selected,
          '&:hover': {
            backgroundColor: palette.action.active,
          },
        },
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: '40px',
        color: palette.text.secondary,
      },
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: {
        fontSize: '1rem',
        fontWeight: 500,
        color: palette.text.primary,
      },
      secondary: {
        fontSize: '0.875rem',
        color: palette.text.secondary,
      },
    },
  },
  // Custom Dynamic Button Component
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '12px 24px',
        fontSize: '1rem',
        fontWeight: 600,
        letterSpacing: '0.025em',
        textTransform: 'none',
        boxShadow: 'none',
        border: '2px solid transparent',
        transition: 'all 0.2s ease-in-out',
        minHeight: '44px',
        position: 'relative',
        overflow: 'hidden',
        
        // Responsive sizing
        [`@media (max-width:${breakpoints.values.sm}px)`]: {
          padding: '10px 20px',
          fontSize: '0.95rem',
          minHeight: '40px',
        },
        [`@media (max-width:${breakpoints.values.xs}px)`]: {
          padding: '8px 16px',
          fontSize: '0.875rem',
          minHeight: '36px',
        },
        
        // Hover effects
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
        
        // Active state
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        },
        
        // Focus state
        '&:focus-visible': {
          outline: `2px solid ${palette.primary.main}`,
          outlineOffset: '2px',
        },
        
        // Disabled state
        '&.Mui-disabled': {
          opacity: 0.6,
          transform: 'none',
          boxShadow: 'none',
        },
      },
      
      // Primary button variant
      contained: {
        backgroundColor: palette.primary.main,
        color: palette.primary.contrastText,
        '&:hover': {
          backgroundColor: palette.primary.dark,
          boxShadow: `0 8px 25px ${palette.primary.main}40`,
        },
        '&:active': {
          backgroundColor: palette.primary.dark,
        },
      },
      
      // Secondary button variant
      outlined: {
        borderColor: palette.secondary.main,
        color: palette.secondary.main,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: palette.secondary.main,
          color: palette.secondary.contrastText,
          borderColor: palette.secondary.main,
          boxShadow: `0 8px 25px ${palette.secondary.main}40`,
        },
        '&:active': {
          backgroundColor: palette.secondary.dark,
          borderColor: palette.secondary.dark,
        },
      },
      
      // Text button variant
      text: {
        color: palette.primary.main,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: `${palette.primary.main}15`,
          boxShadow: `0 4px 15px ${palette.primary.main}20`,
        },
        '&:active': {
          backgroundColor: `${palette.primary.main}25`,
        },
      },
      
      // Success button variant
      containedSuccess: {
        backgroundColor: palette.success.main,
        color: palette.success.contrastText,
        '&:hover': {
          backgroundColor: palette.success.dark,
          boxShadow: `0 8px 25px ${palette.success.main}40`,
        },
      },
      
      // Warning button variant
      containedWarning: {
        backgroundColor: palette.warning.main,
        color: palette.warning.contrastText,
        '&:hover': {
          backgroundColor: palette.warning.dark,
          boxShadow: `0 8px 25px ${palette.warning.main}40`,
        },
      },
      
      // Error button variant
      containedError: {
        backgroundColor: palette.error.main,
        color: palette.error.contrastText,
        '&:hover': {
          backgroundColor: palette.error.dark,
          boxShadow: `0 8px 25px ${palette.error.main}40`,
        },
      },
      
      // Size variants
      sizeSmall: {
        padding: '8px 16px',
        fontSize: '0.9rem',
        minHeight: '36px',
        [`@media (max-width:${breakpoints.values.sm}px)`]: {
          padding: '6px 12px',
          fontSize: '0.85rem',
          minHeight: '32px',
        },
      },
      
      sizeLarge: {
        padding: '16px 32px',
        fontSize: '1.125rem',
        minHeight: '52px',
        [`@media (max-width:${breakpoints.values.sm}px)`]: {
          padding: '14px 28px',
          fontSize: '1rem',
          minHeight: '48px',
        },
      },
      
      // Full width button
      fullWidth: {
        width: '100%',
        justifyContent: 'center',
      },
      
      // Icon button with text
      startIcon: {
        marginRight: '8px',
        [`@media (max-width:${breakpoints.values.sm}px)`]: {
          marginRight: '6px',
        },
      },
      
      endIcon: {
        marginLeft: '8px',
        [`@media (max-width:${breakpoints.values.sm}px)`]: {
          marginLeft: '6px',
        },
      },
    },
  },
};

// Create the theme
const theme = createTheme({
  breakpoints,
  spacing,
  palette,
  typography,
  components,
  shape: {
    borderRadius: 6,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)',
    '0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)',
    '0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)',
    '0 25px 50px rgba(0,0,0,0.1), 0 15px 15px rgba(0,0,0,0.04)',
    '0 30px 60px rgba(0,0,0,0.1), 0 20px 20px rgba(0,0,0,0.04)',
    '0 35px 70px rgba(0,0,0,0.1), 0 25px 25px rgba(0,0,0,0.04)',
    '0 40px 80px rgba(0,0,0,0.1), 0 30px 30px rgba(0,0,0,0.04)',
    '0 45px 90px rgba(0,0,0,0.1), 0 35px 35px rgba(0,0,0,0.04)',
    '0 50px 100px rgba(0,0,0,0.1), 0 40px 40px rgba(0,0,0,0.04)',
    '0 55px 110px rgba(0,0,0,0.1), 0 45px 45px rgba(0,0,0,0.04)',
    '0 60px 120px rgba(0,0,0,0.1), 0 50px 50px rgba(0,0,0,0.04)',
    '0 65px 130px rgba(0,0,0,0.1), 0 55px 55px rgba(0,0,0,0.04)',
    '0 70px 140px rgba(0,0,0,0.1), 0 60px 60px rgba(0,0,0,0.04)',
    '0 75px 150px rgba(0,0,0,0.1), 0 65px 65px rgba(0,0,0,0.04)',
    '0 80px 160px rgba(0,0,0,0.1), 0 70px 70px rgba(0,0,0,0.04)',
    '0 85px 170px rgba(0,0,0,0.1), 0 75px 75px rgba(0,0,0,0.04)',
    '0 90px 180px rgba(0,0,0,0.1), 0 80px 80px rgba(0,0,0,0.04)',
    '0 95px 190px rgba(0,0,0,0.1), 0 85px 85px rgba(0,0,0,0.04)',
    '0 100px 200px rgba(0,0,0,0.1), 0 90px 90px rgba(0,0,0,0.04)',
    '0 105px 210px rgba(0,0,0,0.1), 0 95px 95px rgba(0,0,0,0.04)',
    '0 110px 220px rgba(0,0,0,0.1), 0 100px 100px rgba(0,0,0,0.04)',
    '0 115px 230px rgba(0,0,0,0.1), 0 105px 105px rgba(0,0,0,0.04)',
    '0 120px 240px rgba(0,0,0,0.1), 0 110px 110px rgba(0,0,0,0.04)',
  ],
} as ThemeOptions);

export default theme;
