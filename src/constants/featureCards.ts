import type { gradients } from '@/constants/theme';

export type FeatureAccent = keyof typeof gradients;

export type HomeFeature = {
  id: string;
  label: string;
  icon: string;
  accent: FeatureAccent;
  glowColor: string;
};

export const HOME_FEATURES: HomeFeature[] = [
  {
    id: 'tech',
    label: 'Technical Q&A',
    icon: 'flash',
    accent: 'violet',
    glowColor: '#A855F7',
  },
  {
    id: 'hr',
    label: 'HR Questions',
    icon: 'chatbubbles',
    accent: 'pink',
    glowColor: '#EC4899',
  },
  {
    id: 'dsa',
    label: 'DSA Topics',
    icon: 'code-slash',
    accent: 'orange',
    glowColor: '#F97316',
  },
  {
    id: 'resume',
    label: 'Resume Tips',
    icon: 'document-text',
    accent: 'primary',
    glowColor: '#6366F1',
  },
  {
    id: 'projects',
    label: 'Project Ideas',
    icon: 'rocket',
    accent: 'green',
    glowColor: '#22C55E',
  },
];
