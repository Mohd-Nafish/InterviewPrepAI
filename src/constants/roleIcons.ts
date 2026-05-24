import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

import type { InterviewRole } from '@/types/interview';

type IconName = ComponentProps<typeof Ionicons>['name'];

export const ROLE_ICONS: Record<InterviewRole, IconName> = {
  frontend: 'laptop-outline',
  backend: 'server-outline',
  fullstack: 'layers-outline',
  mobile: 'phone-portrait-outline',
  data: 'analytics-outline',
  product: 'briefcase-outline',
};
