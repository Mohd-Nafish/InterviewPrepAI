import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

import type { HomeFeature } from '@/constants/featureCards';
import { gradients } from '@/constants/theme';
import { cn } from '@/utils/cn';

type Props = {
  feature: HomeFeature;
  className?: string;
};

const gradientMap = {
  primary: gradients.primary,
  hero: gradients.hero,
  cyan: gradients.cyan,
  violet: gradients.violet,
  orange: gradients.orange,
  green: gradients.green,
  pink: gradients.pink,
};

export function FeatureCard({ feature, className }: Props) {
  const gradientColors = gradientMap[feature.accent] ?? gradients.primary;

  return (
    <View
      className={cn('min-w-[100px] flex-1 items-center rounded-2xl border border-border bg-surface px-3 py-4', className)}
      style={{
        shadowColor: feature.glowColor,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      }}>
      <LinearGradient
        colors={[...gradientColors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 10,
        }}>
        <Ionicons
          name={feature.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color="#fff"
        />
      </LinearGradient>
      <Text className="text-center text-xs font-medium leading-4 text-muted" numberOfLines={2}>
        {feature.label}
      </Text>
      <View
        className="mt-3 h-0.5 w-8 rounded-full"
        style={{ backgroundColor: feature.glowColor }}
      />
    </View>
  );
}
