import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/PressableScale';
import { colors, gradients } from '@/constants/theme';
import { cn } from '@/utils/cn';

type IconName = keyof typeof Ionicons.glyphMap;

type Props = {
  label: string;
  selected?: boolean;
  disabled?: boolean;
  icon?: IconName;
  onPress?: () => void;
  className?: string;
};

export function Chip({ label, selected = false, disabled, icon, onPress, className }: Props) {
  const glow = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    glow.value = withTiming(selected ? 1 : 0, { duration: 220 });
  }, [glow, selected]);

  const containerStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.15 + glow.value * 0.5,
    shadowRadius: 6 + glow.value * 8,
    transform: [{ scale: 0.98 + glow.value * 0.02 }],
  }));

  if (selected) {
    return (
      <Animated.View
        style={[
          containerStyle,
          {
            shadowColor: colors.violet,
            shadowOffset: { width: 0, height: 6 },
            elevation: 8,
          },
        ]}>
        <PressableScale
          accessibilityRole="button"
          accessibilityState={{ selected: true, disabled: !!disabled }}
          disabled={disabled}
          onPress={onPress}
          className={cn('overflow-hidden rounded-full', className)}>
          <LinearGradient
            colors={[...gradients.hero]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 18,
              paddingVertical: 11,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.25)',
            }}>
            {icon ? <Ionicons name={icon} size={16} color="#fff" style={{ marginRight: 8 }} /> : null}
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>{label}</Text>
            <Ionicons name="checkmark-circle" size={17} color="#fff" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </PressableScale>
      </Animated.View>
    );
  }

  return (
    <PressableScale
      accessibilityRole="button"
      accessibilityState={{ selected: false, disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn('rounded-full', disabled && 'opacity-60', className)}>
      <View
        className="flex-row items-center rounded-full border border-border/90 bg-surface-elevated px-4 py-2.5"
        style={{
          shadowColor: colors.electricBlue,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 2,
        }}>
        {icon ? (
          <Ionicons name={icon} size={16} color={colors.textSecondary} style={{ marginRight: 8 }} />
        ) : null}
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary }}>{label}</Text>
      </View>
    </PressableScale>
  );
}
