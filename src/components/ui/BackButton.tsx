import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { Platform, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/PressableScale';
import { Text } from '@/components/ui/Text';
import { colors, glow, radius } from '@/constants/theme';
import { cn } from '@/utils/cn';

type Props = {
  onPress: () => void;
  label?: string;
  className?: string;
};

const BLUR_INTENSITY = 10;
const MIN_TOUCH_HEIGHT = 44;

export function BackButton({ onPress, label = 'Back', className }: Props) {
  const pressed = useSharedValue(0);

  const shellStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      pressed.value,
      [0, 1],
      [colors.glassBorder, colors.borderGlow],
    ),
    shadowOpacity: interpolate(pressed.value, [0, 1], [0.08, 0.28]),
    shadowRadius: interpolate(pressed.value, [0, 1], [6, 14]),
  }));

  const iconRingStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      pressed.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.06)', 'rgba(99, 102, 241, 0.45)'],
    ),
    backgroundColor: interpolateColor(
      pressed.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.03)', 'rgba(99, 102, 241, 0.14)'],
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pressed.value, [0, 1], [0.72, 1]),
  }));

  const handlePressIn = () => {
    pressed.value = withTiming(1, { duration: 110 });
  };

  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: 200 });
  };

  const content = (
    <View
      className="flex-row items-center gap-2.5 pl-1.5 pr-4"
      style={{ minHeight: MIN_TOUCH_HEIGHT }}>
      <Animated.View
        style={iconRingStyle}
        className="h-8 w-8 items-center justify-center rounded-full border">
        <Ionicons name="chevron-back" size={17} color={colors.textSecondary} />
      </Animated.View>
      <Animated.View style={labelStyle}>
        <Text variant="label" className="text-[13px] font-medium tracking-wide text-slate-400">
          {label}
        </Text>
      </Animated.View>
    </View>
  );

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={{ top: 10, bottom: 10, left: 6, right: 10 }}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      className={cn('-ml-1 self-start', className)}>
      <Animated.View
        style={[
          shellStyle,
          {
            borderRadius: radius.pill,
            borderWidth: 1,
            overflow: 'hidden',
            shadowColor: glow.blue,
            shadowOffset: { width: 0, height: 0 },
            elevation: 2,
          },
        ]}>
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={BLUR_INTENSITY}
            tint="dark"
            style={{ borderRadius: radius.pill, overflow: 'hidden' }}>
            <View style={{ backgroundColor: colors.glass }}>{content}</View>
          </BlurView>
        ) : (
          <View
            className="overflow-hidden"
            style={{ backgroundColor: colors.glass, borderRadius: radius.pill }}>
            {content}
          </View>
        )}
      </Animated.View>
    </PressableScale>
  );
}
