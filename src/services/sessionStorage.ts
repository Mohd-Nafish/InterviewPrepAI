import AsyncStorage from '@react-native-async-storage/async-storage';

import type { CreatePrepSessionInput, PrepSession } from '@/types/session';

const STORAGE_KEY = '@interviewprepai/sessions';
const MAX_SESSIONS = 50;

function createSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function parseSessions(raw: string | null): PrepSession[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidSession);
  } catch {
    return [];
  }
}

function isValidSession(value: unknown): value is PrepSession {
  if (!value || typeof value !== 'object') return false;

  const session = value as PrepSession;
  return (
    typeof session.id === 'string' &&
    typeof session.createdAt === 'string' &&
    typeof session.jobDescription === 'string' &&
    session.result !== null &&
    typeof session.result === 'object'
  );
}

export async function getSessions(): Promise<PrepSession[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const sessions = parseSessions(raw);
  return sessions.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function saveSession(input: CreatePrepSessionInput): Promise<PrepSession> {
  const sessions = await getSessions();

  const session: PrepSession = {
    id: createSessionId(),
    createdAt: new Date().toISOString(),
    jobDescription: input.jobDescription,
    result: input.result,
  };

  const nextSessions = [session, ...sessions].slice(0, MAX_SESSIONS);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSessions));

  return session;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await getSessions();
  const nextSessions = sessions.filter((session) => session.id !== sessionId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSessions));
}

export async function getSessionById(sessionId: string): Promise<PrepSession | null> {
  const sessions = await getSessions();
  return sessions.find((session) => session.id === sessionId) ?? null;
}
