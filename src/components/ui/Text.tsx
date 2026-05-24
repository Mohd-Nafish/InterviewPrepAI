import { Text as RNText, type TextProps } from 'react-native';

import { cn } from '@/utils/cn';

type TextVariant = 'hero' | 'title' | 'subtitle' | 'body' | 'caption' | 'label';

const variantStyles: Record<TextVariant, string> = {
  hero: 'text-[32px] font-bold leading-10 tracking-tight text-accent',
  title: 'text-2xl font-bold tracking-tight text-accent',
  subtitle: 'text-lg font-semibold text-accent',
  body: 'text-base leading-6 text-slate-300',
  caption: 'text-sm text-muted',
  label: 'text-sm font-semibold text-slate-200',
};

type Props = TextProps & {
  variant?: TextVariant;
};

export function Text({ variant = 'body', className, ...props }: Props) {
  return <RNText className={cn(variantStyles[variant], className)} {...props} />;
}
