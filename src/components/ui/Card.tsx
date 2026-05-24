import { View, type ViewProps } from 'react-native';

import { cn } from '@/utils/cn';

type Props = ViewProps & {
  elevated?: boolean;
};

export function Card({ elevated = false, className, children, ...props }: Props) {
  return (
    <View
      className={cn(
        'rounded-2xl border border-border p-5',
        elevated ? 'bg-surface-elevated' : 'bg-surface',
        className,
      )}
      {...props}>
      {children}
    </View>
  );
}
