export const colors = {
  background: '#050816',
  backgroundElevated: '#0B1024',
  surface: 'rgba(255, 255, 255, 0.04)',
  surfaceElevated: 'rgba(255, 255, 255, 0.08)',
  glass: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  border: 'rgba(255, 255, 255, 0.1)',
  borderGlow: 'rgba(99, 102, 241, 0.4)',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  primary: '#6366F1',
  primaryLight: '#818CF8',
  violet: '#9333EA',
  violetLight: '#A855F7',
  cyan: '#22D3EE',
  electricBlue: '#3B82F6',
  pink: '#EC4899',
  orange: '#F97316',
  green: '#22C55E',
  destructive: '#F87171',
  amber: '#FBBF24',
} as const;

export const gradients = {
  primary: ['#4F46E5', '#9333EA'] as const,
  hero: ['#6366F1', '#8B5CF6', '#A855F7'] as const,
  cyan: ['#22D3EE', '#6366F1'] as const,
  violet: ['#7C3AED', '#EC4899'] as const,
  orange: ['#F97316', '#FBBF24'] as const,
  green: ['#10B981', '#22D3EE'] as const,
  pink: ['#EC4899', '#9333EA'] as const,
};

export const glow = {
  blue: 'rgba(59, 130, 246, 0.45)',
  violet: 'rgba(147, 51, 234, 0.5)',
  cyan: 'rgba(34, 211, 238, 0.35)',
  pink: 'rgba(236, 72, 153, 0.4)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  hero: {
    fontSize: 32,
    fontWeight: '700' as const,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  title: {
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
  },
} as const;

export const maxContentWidth = 640;
