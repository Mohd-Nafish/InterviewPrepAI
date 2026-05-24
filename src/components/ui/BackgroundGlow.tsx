import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, glow } from '@/constants/theme';

function Orb({
  color,
  size,
  top,
  left,
  right,
  bottom,
  delay = 0,
}: {
  color: string;
  size: number;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  delay?: number;
}) {
  const opacity = useSharedValue(0.35);

  useEffect(() => {
    const timeout = setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.55, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.25, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orb,
        animatedStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          top,
          left,
          right,
          bottom,
        },
      ]}
    />
  );
}

export function BackgroundGlow() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      <Orb color={glow.violet} size={280} top={-80} right={-60} delay={0} />
      <Orb color={glow.blue} size={220} top={120} left={-80} delay={400} />
      <Orb color={glow.cyan} size={180} bottom={120} right={-40} delay={800} />

      {STARS.map((star, index) => (
        <View
          key={`star-${index}`}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              opacity: star.opacity,
              width: star.size,
              height: star.size,
            },
          ]}
        />
      ))}
    </View>
  );
}

const STARS = [
  { top: '12%', left: '18%', opacity: 0.35, size: 2 },
  { top: '22%', left: '72%', opacity: 0.25, size: 2 },
  { top: '38%', left: '45%', opacity: 0.2, size: 1.5 },
  { top: '55%', left: '85%', opacity: 0.3, size: 2 },
  { top: '68%', left: '12%', opacity: 0.22, size: 1.5 },
  { top: '78%', left: '58%', opacity: 0.28, size: 2 },
] as const;

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
  },
  star: {
    position: 'absolute',
    borderRadius: 99,
    backgroundColor: '#E2E8F0',
  },
});
