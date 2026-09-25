import { Theme } from '@mui/material/styles';

// Common spacing values
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// Common border radius values
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: '50%',
} as const;

// Common shadow values
export const SHADOWS = {
  light: '0 2px 4px rgba(0,0,0,0.1)',
  medium: '0 4px 8px rgba(0,0,0,0.15)',
  heavy: '0 8px 16px rgba(0,0,0,0.2)',
  hover: '0 6px 20px rgba(0,0,0,0.25)',
} as const;

// Common transition values
export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  normal: '250ms ease-in-out',
  slow: '350ms ease-in-out',
} as const;

// Responsive breakpoint helpers
export const BREAKPOINTS = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

// Common layout styles
export const LAYOUT_STYLES = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
    [`@media (min-width:${BREAKPOINTS.tablet}px)`]: {
      padding: '0 24px',
    },
    [`@media (min-width:${BREAKPOINTS.desktop}px)`]: {
      padding: '0 32px',
    },
  },
  section: {
    padding: `${SPACING.xl}px 0`,
    [`@media (max-width:${BREAKPOINTS.tablet - 1}px)`]: {
      padding: `${SPACING.lg}px 0`,
    },
    [`@media (max-width:${BREAKPOINTS.mobile}px)`]: {
      padding: `${SPACING.md}px 0`,
    },
  },
  card: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.light,
    transition: `box-shadow ${TRANSITIONS.normal}`,
    '&:hover': {
      boxShadow: SHADOWS.hover,
    },
    [`@media (max-width:${BREAKPOINTS.tablet - 1}px)`]: {
      padding: SPACING.md,
    },
  },
} as const;

// Common component styles
export const COMPONENT_STYLES = {
  button: {
    primary: {
      borderRadius: BORDER_RADIUS.md,
      padding: `${SPACING.sm}px ${SPACING.lg}px`,
      transition: `all ${TRANSITIONS.fast}`,
      '&:hover': {
        transform: 'translateY(-1px)',
        boxShadow: SHADOWS.medium,
      },
    },
    secondary: {
      borderRadius: BORDER_RADIUS.md,
      padding: `${SPACING.sm}px ${SPACING.lg}px`,
      border: '2px solid',
      transition: `all ${TRANSITIONS.fast}`,
      '&:hover': {
        transform: 'translateY(-1px)',
      },
    },
  },
  input: {
    borderRadius: BORDER_RADIUS.md,
    transition: `border-color ${TRANSITIONS.fast}`,
    '&:focus-within': {
      borderColor: 'primary.main',
    },
  },
  card: {
    borderRadius: BORDER_RADIUS.lg,
    boxShadow: SHADOWS.light,
    transition: `all ${TRANSITIONS.normal}`,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: SHADOWS.hover,
    },
  },
} as const;

// Responsive grid system
export const GRID_SYSTEM = {
  container: {
    display: 'grid',
    gap: SPACING.lg,
    gridTemplateColumns: '1fr',
    [`@media (min-width:${BREAKPOINTS.tablet}px)`]: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: SPACING.xl,
    },
    [`@media (min-width:${BREAKPOINTS.desktop}px)`]: {
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: SPACING.xxl,
    },
    [`@media (min-width:${BREAKPOINTS.wide}px)`]: {
      gridTemplateColumns: 'repeat(4, 1fr)',
    },
  },
  sidebar: {
    display: 'grid',
    gap: SPACING.lg,
    gridTemplateColumns: '1fr',
    [`@media (min-width:${BREAKPOINTS.desktop}px)`]: {
      gridTemplateColumns: '250px 1fr',
      gap: SPACING.xl,
    },
  },
} as const;

// Utility functions for responsive design
export const createResponsiveValue = <T>(
  mobile: T,
  tablet: T,
  desktop: T,
  wide?: T
) => ({
  [BREAKPOINTS.mobile]: mobile,
  [BREAKPOINTS.tablet]: tablet,
  [BREAKPOINTS.desktop]: desktop,
  ...(wide && { [BREAKPOINTS.wide]: wide }),
});

export const createResponsiveSpacing = (
  mobile: keyof typeof SPACING,
  tablet: keyof typeof SPACING,
  desktop: keyof typeof SPACING,
  wide?: keyof typeof SPACING
) => createResponsiveValue(
  SPACING[mobile],
  SPACING[tablet],
  SPACING[desktop],
  wide ? SPACING[wide] : undefined
);

// Common flexbox utilities
export const FLEX_UTILS = {
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  between: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  start: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  end: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  columnCenter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
} as const;

// Export theme-aware styles
export const createThemeStyles = (theme: Theme) => ({
  ...LAYOUT_STYLES,
  ...COMPONENT_STYLES,
  ...GRID_SYSTEM,
  ...FLEX_UTILS,
  // Theme-specific overrides can be added here
  themeColors: {
    primary: theme.palette.primary.main,
    secondary: theme.palette.secondary.main,
    background: theme.palette.background.default,
    surface: theme.palette.background.paper,
    text: theme.palette.text.primary,
    textSecondary: theme.palette.text.secondary,
  },
});

// Default export for easy importing
export default {
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TRANSITIONS,
  BREAKPOINTS,
  LAYOUT_STYLES,
  COMPONENT_STYLES,
  GRID_SYSTEM,
  FLEX_UTILS,
  createResponsiveValue,
  createResponsiveSpacing,
  createThemeStyles,
};

