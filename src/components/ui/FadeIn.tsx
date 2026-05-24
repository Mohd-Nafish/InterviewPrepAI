import type { ReactNode } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { cn } from '@/utils/cn';

type Props = {
  children: ReactNode;
  index?: number;
  className?: string;
};

const STAGGER_MS = 75;
const DURATION_MS = 480;

export function FadeIn({ children, index = 0, className }: Props) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * STAGGER_MS)
        .duration(DURATION_MS)
        .springify()
        .damping(20)
        .stiffness(140)}
      className={cn(className)}>
      {children}
    </Animated.View>
  );
}
