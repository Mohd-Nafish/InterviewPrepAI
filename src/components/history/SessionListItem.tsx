import { Alert, Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { GlowCard, Text } from '@/components/ui';
import { ROLE_OPTIONS } from '@/constants/roles';
import { getTotalItemCount } from '@/constants/resultSections';
import { colors } from '@/constants/theme';
import type { PrepSession } from '@/types/session';
import { formatSessionDate } from '@/utils/formatDate';

type Props = {
  session: PrepSession;
  onOpen: (session: PrepSession) => void;
  onDelete: (sessionId: string) => void;
};

export function SessionListItem({ session, onOpen, onDelete }: Props) {
  const roleLabel =
    ROLE_OPTIONS.find((option) => option.value === session.result.role)?.label ??
    session.result.role;
  const itemCount = getTotalItemCount(session.result);

  const handleDelete = () => {
    Alert.alert(
      'Delete session',
      'Remove this prep plan from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(session.id),
        },
      ],
    );
  };

  return (
    <GlowCard glowColor={colors.primary} className="p-0">
      <View className="flex-row items-start gap-3 px-4 py-4">
        <Pressable className="flex-1" onPress={() => onOpen(session)}>
          <Text variant="subtitle" numberOfLines={2}>
            {session.result.jobTitle}
          </Text>
          <View className="mt-2 flex-row flex-wrap gap-2">
            <View className="rounded-full border border-border bg-background/50 px-2.5 py-0.5">
              <Text variant="caption" className="text-xs">
                {roleLabel}
              </Text>
            </View>
            <View className="rounded-full border border-border bg-background/50 px-2.5 py-0.5">
              <Text variant="caption" className="text-xs">
                {itemCount} insights
              </Text>
            </View>
          </View>
          <Text variant="caption" className="mt-3">
            {formatSessionDate(session.createdAt)}
          </Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete session"
          className="rounded-xl border border-border bg-background/40 p-2.5"
          hitSlop={8}
          onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={colors.destructive} />
        </Pressable>
      </View>
    </GlowCard>
  );
}
