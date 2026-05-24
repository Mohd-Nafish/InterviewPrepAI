import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import { colors, gradients } from '@/constants/theme';

export function AIHeroVisual() {
  const floatY = useSharedValue(0);
  const pulse = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-8, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    pulse.value = withRepeat(
      withTiming(1.08, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [floatY, pulse]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }, { scale: pulse.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(99, 102, 241, 0.15)', 'rgba(147, 51, 234, 0.05)']}
        style={styles.platformBack}
      />
      <LinearGradient
        colors={[...gradients.cyan]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.platformFront}
      />

      <Animated.View style={[styles.brainWrap, floatStyle]}>
        <LinearGradient colors={[...gradients.hero]} style={styles.brain}>
          <Ionicons name="sparkles" size={28} color="#fff" />
        </LinearGradient>
        <View style={[styles.particle, styles.p1]} />
        <View style={[styles.particle, styles.p2]} />
        <View style={[styles.particle, styles.p3]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 110,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  platformBack: {
    position: 'absolute',
    bottom: 8,
    width: 88,
    height: 22,
    borderRadius: 12,
    opacity: 0.8,
  },
  platformFront: {
    position: 'absolute',
    bottom: 0,
    width: 72,
    height: 18,
    borderRadius: 10,
    opacity: 0.9,
  },
  brainWrap: {
    alignItems: 'center',
    marginBottom: 22,
  },
  brain: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.violet,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 10,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cyan,
  },
  p1: { top: -4, right: -8 },
  p2: { top: 12, left: -12 },
  p3: { bottom: 4, right: -14 },
});
