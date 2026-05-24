import type { InterviewRole } from '@/types/interview';

export type RoleOption = {
  value: InterviewRole;
  label: string;
};

export const ROLE_OPTIONS: RoleOption[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'fullstack', label: 'Full Stack' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'data', label: 'Data' },
  { value: 'product', label: 'Product' },
];
