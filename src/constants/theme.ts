import { Platform } from 'react-native';

export const Palette = {
  // Primary Visual System Tokens
  primaryNavy: '#102A43',
  actionBlue: '#2F80ED',
  background: '#F7F9FC',
  surface: '#FFFFFF',

  // Status & Semantic Tokens
  successGreen: '#27AE60',
  warningOrange: '#F2994A',
  errorRed: '#EB5757',

  // Typography & Neutrals
  textDark: '#17202A',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  border: '#E2E8F0',
  borderSubtle: '#EDF2F7',

  // Soft Tint Backgrounds
  blueTint: '#EBF3FE',
  greenTint: '#EAF7EE',
  orangeTint: '#FEF5EC',
  redTint: '#FDECEC',
  navyTint: '#E8ECF2',
} as const;

export const Colors = {
  light: {
    primary: Palette.primaryNavy,
    accent: Palette.actionBlue,
    background: Palette.background,
    card: Palette.surface,
    text: Palette.textDark,
    textSecondary: Palette.textSecondary,
    border: Palette.border,
    success: Palette.successGreen,
    warning: Palette.warningOrange,
    error: Palette.errorRed,
    tint: Palette.actionBlue,
    tabIconDefault: '#94A3B8',
    tabIconSelected: Palette.primaryNavy,
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
  },
  dark: {
    primary: '#1E3A5F',
    accent: '#3B82F6',
    background: '#0F172A',
    card: '#1E293B',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    success: Palette.successGreen,
    warning: Palette.warningOrange,
    error: Palette.errorRed,
    tint: '#3B82F6',
    tabIconDefault: '#64748B',
    tabIconSelected: '#60A5FA',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  screenPadding: 24,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const Radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  card: 18,
  modal: 24,
  pill: 9999,
} as const;

export const Shadows = {
  card: {
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  glowBlue: {
    shadowColor: '#2F80ED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
};

export const Typography = {
  h1: { fontSize: 26, fontWeight: '700' as const, color: Palette.textDark, letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '700' as const, color: Palette.textDark, letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '600' as const, color: Palette.textDark },
  body: { fontSize: 15, fontWeight: '400' as const, color: Palette.textDark, lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const, color: Palette.textDark },
  caption: { fontSize: 13, fontWeight: '500' as const, color: Palette.textSecondary },
  small: { fontSize: 11, fontWeight: '600' as const, color: Palette.textSecondary, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
};
