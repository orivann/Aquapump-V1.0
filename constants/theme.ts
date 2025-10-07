export const lightTheme = {
  colors: {
    primary: '#19C3E6',
    secondary: '#E9EEF5',
    accent: '#DCE6F1',
    dark: '#111827',
    light: '#FFFFFF',
    gray: '#64748B',
    chrome: '#475569',
    success: '#10B981',
  },
  gradients: {
    hero: ['#E9EEF5', '#E2E8F0', '#E9EEF5'],
    chrome: ['#94A3B8', '#64748B', '#94A3B8'],
    water: ['#19C3E6', '#0EA5E9', '#19C3E6'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.16,
      shadowRadius: 20,
      elevation: 8,
    },
  },
};

export const darkTheme = {
  colors: {
    primary: '#19C3E6',
    secondary: '#0A1929',
    accent: '#10243A',
    dark: '#050A14',
    light: '#FFFFFF',
    gray: '#8B9AA8',
    chrome: '#C0C8D0',
    success: '#00FF88',
  },
  gradients: {
    hero: ['#0A1929', '#10243A', '#0A1929'],
    chrome: ['#8B9AA8', '#C0C8D0', '#8B9AA8'],
    water: ['#19C3E6', '#0EA5E9', '#19C3E6'],
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#19C3E6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#19C3E6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export type Theme = typeof lightTheme;