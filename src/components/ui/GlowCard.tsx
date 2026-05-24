import { BlurView } from 'expo-blur';
import { Platform, View, type ViewProps } from 'react-native';

import { colors } from '@/constants/theme';
import { cn } from '@/utils/cn';

type Props = ViewProps & {
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
  noPadding?: boolean;
};

const intensityMap = {
  low: 12,
  medium: 24,
  high: 36,
};

export function GlowCard({
  glowColor,
  intensity = 'medium',
  noPadding = false,
  className,
  children,
  style,
  ...props
}: Props) {
  const borderColor = glowColor ?? colors.glassBorder;

  return (
    <View
      className={cn('overflow-hidden rounded-2xl', className)}
      style={[
        glowColor
          ? {
              shadowColor: glowColor,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 8,
            }
          : undefined,
        style,
      ]}
      {...props}>
      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={intensityMap[intensity]}
          tint="dark"
          style={{ borderRadius: 16, borderWidth: 1, borderColor, overflow: 'hidden' }}>
          <View
            style={{
              backgroundColor: colors.glass,
              ...(noPadding ? {} : { paddingHorizontal: 20, paddingVertical: 16 }),
            }}>
            {children}
          </View>
        </BlurView>
      ) : (
        <View
          className={cn(
            'overflow-hidden rounded-2xl border bg-surface-elevated',
            !noPadding && 'px-5 py-4',
          )}
          style={{ borderColor }}>
          {children}
        </View>
      )}
    </View>
  );
}
