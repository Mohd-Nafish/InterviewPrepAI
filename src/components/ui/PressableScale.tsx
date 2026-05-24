import type { ReactNode } from 'react';
import { Pressable, type PressableProps } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { cn } from '@/utils/cn';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Props = PressableProps & {
  scaleTo?: number;
  children: ReactNode;
};

export function PressableScale({
  scaleTo = 0.97,
  disabled,
  className,
  children,
  onPressIn,
  onPressOut,
  ...props
}: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      disabled={disabled}
      className={className}
      style={animatedStyle}
      onPressIn={(event) => {
        if (!disabled) {
          scale.value = withSpring(scaleTo, { damping: 16, stiffness: 320 });
        }
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1, { damping: 14, stiffness: 280 });
        onPressOut?.(event);
      }}
      {...props}>
      {children}
    </AnimatedPressable>
  );
}
