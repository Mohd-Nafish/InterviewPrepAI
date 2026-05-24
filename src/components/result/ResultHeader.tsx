import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { GlowCard, Text } from '@/components/ui';
import { ROLE_OPTIONS } from '@/constants/roles';
import { colors, gradients } from '@/constants/theme';
import type { InterviewPrepResult } from '@/types/interview';

type Props = {
  result: InterviewPrepResult;
  totalItems: number;
};

export function ResultHeader({ result, totalItems }: Props) {
  const roleLabel =
    ROLE_OPTIONS.find((option) => option.value === result.role)?.label ?? result.role;

  return (
    <GlowCard glowColor={colors.violet}>
      <View className="flex-row items-start gap-3">
        <LinearGradient
          colors={[...gradients.hero]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="checkmark-done" size={24} color="#fff" />
        </LinearGradient>

        <View className="flex-1">
          <Text variant="caption" className="uppercase tracking-widest">
            Prep plan ready
          </Text>
          <Text variant="title" className="mt-2">
            {result.jobTitle}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row flex-wrap gap-2">
        <View className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1">
          <Text variant="caption" className="text-indigo-200">
            {roleLabel}
          </Text>
        </View>
        <View className="rounded-full border border-border bg-background/40 px-3 py-1">
          <Text variant="caption">{totalItems} insights</Text>
        </View>
        <View className="rounded-full border border-border bg-background/40 px-3 py-1">
          <Text variant="caption">5 sections</Text>
        </View>
      </View>

      <Text variant="body" className="mt-4 leading-6">
        Your personalized interview plan is ready. Expand each section and practice answers aloud.
      </Text>
    </GlowCard>
  );
}
