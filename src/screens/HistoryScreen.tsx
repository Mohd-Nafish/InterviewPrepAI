import { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { SessionListItem } from '@/components/history';
import { AppHeader, Button, FadeIn, GlowCard, ScreenContainer, Text } from '@/components/ui';
import { colors } from '@/constants/theme';
import { useSessionHistory } from '@/hooks/useSessionHistory';
import type { RootStackParamList } from '@/navigation/types';
import type { PrepSession } from '@/types/session';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

export function HistoryScreen({ navigation }: Props) {
  const { sessions, loading, error, loadSessions, removeSession } = useSessionHistory();

  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [loadSessions]),
  );

  const handleOpen = (session: PrepSession) => {
    navigation.navigate('Result', {
      result: session.result,
      sessionId: session.id,
    });
  };

  const handleDelete = async (sessionId: string) => {
    await removeSession(sessionId);
  };

  return (
    <ScreenContainer scroll>
      <FadeIn index={0}>
        <AppHeader />
        <Text variant="title" className="mt-6">
          Saved prep sessions
        </Text>
        <Text variant="body" className="mt-2">
          Open a previous plan or remove sessions you no longer need.
        </Text>
        <Button
          label="Back to home"
          variant="ghost"
          className="mt-4 h-10 self-start px-0"
          onPress={() => navigation.goBack()}
        />
      </FadeIn>

      {loading ? (
        <View className="mt-16 items-center">
          <ActivityIndicator color={colors.primaryLight} size="large" />
        </View>
      ) : null}

      {error ? (
        <FadeIn index={1} className="mt-6">
          <View className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3">
            <Text className="text-destructive" variant="caption">
              {error}
            </Text>
          </View>
        </FadeIn>
      ) : null}

      {!loading && sessions.length === 0 ? (
        <FadeIn index={2} className="mt-10">
          <GlowCard>
            <Text variant="subtitle">No saved sessions yet</Text>
            <Text variant="caption" className="mt-2 leading-5">
              Generate a prep plan on the home screen and it will appear here automatically.
            </Text>
            <View className="mt-6">
              <Button label="Go to home" variant="secondary" onPress={() => navigation.goBack()} />
            </View>
          </GlowCard>
        </FadeIn>
      ) : null}

      {!loading && sessions.length > 0 ? (
        <View className="mt-8 gap-3 pb-4">
          {sessions.map((session, index) => (
            <FadeIn key={session.id} index={index + 2}>
              <SessionListItem session={session} onOpen={handleOpen} onDelete={handleDelete} />
            </FadeIn>
          ))}
        </View>
      ) : null}
    </ScreenContainer>
  );
}
