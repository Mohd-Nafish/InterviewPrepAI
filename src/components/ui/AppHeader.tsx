import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui/Text';
import { colors, gradients } from '@/constants/theme';

type Props = {
  onHistoryPress?: () => void;
  historyDisabled?: boolean;
};

export function AppHeader({ onHistoryPress, historyDisabled }: Props) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        <LinearGradient
          colors={[...gradients.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Ionicons name="sparkles" size={22} color="#fff" />
        </LinearGradient>
        <View>
          <Text variant="label" className="text-accent">
            InterviewPrep AI
          </Text>
          <Text variant="caption">Your AI interview copilot</Text>
        </View>
      </View>

      {onHistoryPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="History"
          disabled={historyDisabled}
          onPress={onHistoryPress}
          className="h-11 w-11 items-center justify-center rounded-full border border-border bg-surface"
          style={{ opacity: historyDisabled ? 0.5 : 1 }}>
          <Ionicons name="time-outline" size={22} color={colors.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}
