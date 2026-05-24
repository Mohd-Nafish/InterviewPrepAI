import { useCallback, useState } from 'react';

import { deleteSession, getSessions, saveSession } from '@/services/sessionStorage';
import type { CreatePrepSessionInput, PrepSession } from '@/types/session';

type State = {
  sessions: PrepSession[];
  loading: boolean;
  error: string | null;
};

export function useSessionHistory() {
  const [state, setState] = useState<State>({
    sessions: [],
    loading: true,
    error: null,
  });

  const loadSessions = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const sessions = await getSessions();
      setState({ sessions, loading: false, error: null });
    } catch {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: 'Could not load saved sessions.',
      }));
    }
  }, []);

  const persistSession = useCallback(async (input: CreatePrepSessionInput) => {
    try {
      const session = await saveSession(input);
      setState((prev) => ({
        ...prev,
        sessions: [session, ...prev.sessions.filter((s) => s.id !== session.id)].slice(0, 50),
        error: null,
      }));
      return session;
    } catch {
      return null;
    }
  }, []);

  const removeSession = useCallback(async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.filter((session) => session.id !== sessionId),
        error: null,
      }));
      return true;
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'Could not delete this session.',
      }));
      return false;
    }
  }, []);

  return {
    ...state,
    loadSessions,
    persistSession,
    removeSession,
  };
}
