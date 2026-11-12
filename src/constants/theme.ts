export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryMuted: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  overdue: string;
  overdueMuted: string;
  completed: string;
  completedMuted: string;
  priorityLowBg: string;
  priorityLowText: string;
  priorityMediumBg: string;
  priorityMediumText: string;
  priorityHighBg: string;
  priorityHighText: string;
}

export const themes: Record<ThemeMode, ThemeColors> = {
  light: {
    primary: '#6C5CE7',
    primaryMuted: '#EFE9FD',
    background: '#F7F8FA',
    surface: '#FFFFFF',
    textPrimary: '#202431',
    textSecondary: '#687082',
    border: '#E5E7EB',
    overdue: '#C95449',
    overdueMuted: '#FDF2F1',
    completed: '#27865A',
    completedMuted: '#EAF6F0',
    priorityLowBg: '#EEF2F6',
    priorityLowText: '#4B5563',
    priorityMediumBg: '#FEF5E7',
    priorityMediumText: '#B45309',
    priorityHighBg: '#FDF2F1',
    priorityHighText: '#C95449',
  },
  dark: {
    primary: '#6C5CE7',
    primaryMuted: '#2C274C',
    background: '#171B25',
    surface: '#242936',
    textPrimary: '#F5F5F8',
    textSecondary: '#9CA3AF',
    border: '#32394A',
    overdue: '#C95449',
    overdueMuted: '#3B2325',
    completed: '#27865A',
    completedMuted: '#1E382D',
    priorityLowBg: '#2E3444',
    priorityLowText: '#D1D5DB',
    priorityMediumBg: '#3D3122',
    priorityMediumText: '#FBBF24',
    priorityHighBg: '#3B2325',
    priorityHighText: '#F28B82',
  },
};

export const RADIUS = {
  input: 12,
  button: 12,
  card: 16,
  panel: 20,
  pill: 999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const ICON_SIZE = {
  sm: 16,
  md: 20,
  lg: 22,
  xl: 28,
} as const;

export const ICON_STROKE = 2;

