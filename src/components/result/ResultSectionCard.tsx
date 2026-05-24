import { useEffect, useState } from 'react';
import { LayoutAnimation, Platform, UIManager, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { GlowCard, Text } from '@/components/ui';
import { PressableScale } from '@/components/ui/PressableScale';
import type { ResultSectionConfig } from '@/constants/resultSections';
import { gradients } from '@/constants/theme';

import { ResultItem } from './ResultItem';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  section: ResultSectionConfig;
  items: string[];
  defaultExpanded?: boolean;
};

export function ResultSectionCard({
  section,
  items,
  defaultExpanded = true,
}: Props) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const chevronRotation = useSharedValue(expanded ? 1 : 0);
  const gradientColors = gradients[section.accent] ?? gradients.primary;

  useEffect(() => {
    chevronRotation.value = withTiming(expanded ? 1 : 0, { duration: 220 });
  }, [chevronRotation, expanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value * 180}deg` }],
  }));

  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((value) => !value);
  };

  return (
    <GlowCard glowColor={section.glowColor} noPadding className="overflow-hidden">
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={toggleExpanded}
        className="px-5 py-5">
        <View className="flex-row items-start gap-4">
          <LinearGradient
            colors={[...gradientColors]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Ionicons
              name={section.icon as keyof typeof Ionicons.glyphMap}
              size={22}
              color="#fff"
            />
          </LinearGradient>

          <View className="flex-1">
            <View className="flex-row items-center justify-between gap-3">
              <Text variant="subtitle" className="flex-1">
                {section.title}
              </Text>
              <Animated.View style={chevronStyle}>
                <Ionicons name="chevron-down" size={20} color="#94A3B8" />
              </Animated.View>
            </View>
            <Text variant="caption" className="mt-1.5 leading-5">
              {section.description}
            </Text>
            <View className="mt-3 self-start rounded-full border border-border/80 bg-background/50 px-3 py-1">
              <Text variant="caption" className="text-xs">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Text>
            </View>
          </View>
        </View>
      </PressableScale>

      {expanded ? (
        <View className="border-t border-border/40 px-5 pb-4 pt-1">
          {items.map((item, index) => (
            <ResultItem
              key={`${section.key}-${index}`}
              index={index + 1}
              text={item}
              accent={section.accent}
              isLast={index === items.length - 1}
            />
          ))}
        </View>
      ) : null}
    </GlowCard>
  );
}
