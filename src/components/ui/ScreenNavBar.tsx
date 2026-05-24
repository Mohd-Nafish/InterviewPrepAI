import type { ReactNode } from 'react';
import { View, type ViewProps } from 'react-native';

import { BackButton } from '@/components/ui/BackButton';
import { cn } from '@/utils/cn';

type Props = ViewProps & {
  onBack: () => void;
  backLabel?: string;
  trailing?: ReactNode;
};

export function ScreenNavBar({ onBack, backLabel, trailing, className, ...props }: Props) {
  return (
    <View className={cn('mb-1 flex-row items-center justify-between', className)} {...props}>
      <BackButton onPress={onBack} label={backLabel} />
      {trailing ? <View className="flex-row items-center">{trailing}</View> : null}
    </View>
  );
}
