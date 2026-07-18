/**
 * Design System — Theme Tokens
 * Dark navy base, teal accent, amber highlight
 */

export const Colors = {
  // Backgrounds
  background: '#0A1628',
  surface: '#0F2040',
  surfaceElevated: '#162B52',
  surfaceCard: '#1A3360',

  // Accents
  primary: '#00D4AA',
  primaryDark: '#00A885',
  primaryLight: '#33DDBB',

  // Secondary
  secondary: '#FFB020',
  secondaryDark: '#E09010',
  secondaryLight: '#FFC84D',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A8C0D6',
  textMuted: '#5A7A9A',
  textInverse: '#0A1628',

  // Status
  success: '#00D4AA',
  error: '#FF5252',
  warning: '#FFB020',
  info: '#4DAAFF',

  // Borders
  border: 'rgba(0, 212, 170, 0.15)',
  borderFocus: 'rgba(0, 212, 170, 0.6)',
  borderStrong: 'rgba(0, 212, 170, 0.3)',

  // Overlays / Glassmorphism
  glass: 'rgba(15, 32, 64, 0.85)',
  glassLight: 'rgba(26, 51, 96, 0.6)',
  overlay: 'rgba(10, 22, 40, 0.7)',

  // Shadows
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  shadowPrimary: 'rgba(0, 212, 170, 0.3)',

  // Tab bar
  tabActive: '#00D4AA',
  tabInactive: '#5A7A9A',
  tabBackground: '#0A1628',

  // Cart badge
  badge: '#FF5252',

  // Transparent
  transparent: 'transparent',
} as const;

export const Gradients = {
  primary: ['#00D4AA', '#0099CC'] as const,
  primaryReverse: ['#0099CC', '#00D4AA'] as const,
  secondary: ['#FFB020', '#FF7820'] as const,
  background: ['#0A1628', '#0F2040'] as const,
  card: ['#1A3360', '#0F2040'] as const,
  danger: ['#FF5252', '#CC0000'] as const,
  dark: ['#162B52', '#0A1628'] as const,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  giant: 64,
} as const;

export const BorderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const Typography = {
  // Font sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 28,
  xxxl: 36,
  display: 44,

  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,

  // Line heights
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

export const Shadows = {
  sm: {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  lg: {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  primary: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  danger: {
    shadowColor: Colors.error,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

export const AnimationDuration = {
  fast: 150,
  normal: 250,
  slow: 400,
} as const;

export default {
  Colors,
  Gradients,
  Spacing,
  BorderRadius,
  Typography,
  Shadows,
  AnimationDuration,
};
