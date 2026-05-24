import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View, type PressableProps } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { PressableScale } from '@/components/ui/PressableScale';
import { colors, gradients } from '@/constants/theme';
import { cn } from '@/utils/cn';

const MUTED_GRADIENT = ['#3D4480', '#5B4578'] as const;
type Props = PressableProps & {
  label: string;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
};

export function GradientButton({
  label,
  loading = false,
  disabled,
  icon = 'sparkles',
  className,
  ...props
}: Props) {
  const isInactive = Boolean(disabled && !loading);
  const emphasis = useSharedValue(isInactive ? 0 : 1);

  useEffect(() => {
    emphasis.value = withTiming(isInactive ? 0 : 1, { duration: 220 });
  }, [emphasis, isInactive]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.25 + emphasis.value * 0.45,
    transform: [{ scale: 0.96 + emphasis.value * 0.04 }],
  }));

  const isDisabled = disabled || loading;

  return (
    <View className={cn('w-full', className)}>
      <Animated.View
        pointerEvents="none"
        style={[
          glowStyle,
          {
            position: 'absolute',
            left: 12,
            right: 12,
            top: 12,
            bottom: -4,
            borderRadius: 20,
            backgroundColor: colors.violet,
            shadowColor: colors.violet,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.55,
            shadowRadius: 18,
          },
        ]}
      />

      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        scaleTo={isInactive ? 1 : 0.98}
        className="w-full"
        {...props}>
        <View className="w-full overflow-hidden rounded-2xl">
          {isInactive ? (
            <LinearGradient
              colors={[...MUTED_GRADIENT]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={buttonInnerStyle}>
              {renderContent({ loading, icon, label, muted: true })}
            </LinearGradient>
          ) : (
            <LinearGradient
              colors={[...gradients.primary]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={buttonInnerStyle}>
              {renderContent({ loading, icon, label, muted: false })}
            </LinearGradient>
          )}
        </View>
      </PressableScale>
    </View>
  );
}

const buttonInnerStyle = {
  borderRadius: 16,
  paddingVertical: 16,
  paddingHorizontal: 20,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  minHeight: 56,
};

function renderContent({
  loading,
  icon,
  label,
  muted,
}: {
  loading: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  muted: boolean;
}) {
  if (loading) {
    return <ActivityIndicator color="#fff" />;
  }

  const textColor = muted ? 'rgba(255,255,255,0.75)' : '#fff';
  const iconBg = muted ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.2)';

  return (
    <>
      <Ionicons name={icon} size={20} color={textColor} />
      <Text
        style={{
          marginLeft: 10,
          marginRight: 10,
          fontSize: 16,
          fontWeight: '600',
          color: textColor,
          textAlign: 'center',
        }}>
        {label}
      </Text>
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: iconBg,
        }}>
        <Ionicons name="arrow-forward" size={16} color={textColor} />
      </View>
    </>
  );
}
