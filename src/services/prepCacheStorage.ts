import AsyncStorage from '@react-native-async-storage/async-storage';

import { MAX_PREP_CACHE_ENTRIES, PREP_CACHE_TTL_MS } from '@/constants/api';
import { buildPrepCacheKey } from '@/utils/hashInput';
import type { InterviewPrepRequest, InterviewPrepResult, InterviewRole } from '@/types/interview';

const CACHE_STORAGE_KEY = '@interviewprepai/prep_cache';

export type PrepCacheEntry = {
  key: string;
  jobDescription: string;
  role: InterviewRole;
  result: InterviewPrepResult;
  cachedAt: string;
};

type PrepCacheStore = Record<string, PrepCacheEntry>;

function parseStore(raw: string | null): PrepCacheStore {
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as PrepCacheStore;
  } catch {
    return {};
  }
}

function isExpired(entry: PrepCacheEntry): boolean {
  const cachedAt = new Date(entry.cachedAt).getTime();
  if (Number.isNaN(cachedAt)) return true;
  return Date.now() - cachedAt > PREP_CACHE_TTL_MS;
}

function isValidEntry(value: unknown): value is PrepCacheEntry {
  if (!value || typeof value !== 'object') return false;
  const entry = value as PrepCacheEntry;
  return (
    typeof entry.key === 'string' &&
    typeof entry.jobDescription === 'string' &&
    typeof entry.role === 'string' &&
    typeof entry.cachedAt === 'string' &&
    entry.result !== null &&
    typeof entry.result === 'object'
  );
}

async function readStore(): Promise<PrepCacheStore> {
  const raw = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
  const store = parseStore(raw);
  const validEntries = Object.values(store).filter(isValidEntry);
  const freshEntries = validEntries.filter((entry) => !isExpired(entry));

  if (freshEntries.length !== validEntries.length) {
    const nextStore = Object.fromEntries(freshEntries.map((entry) => [entry.key, entry]));
    await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(nextStore));
    return nextStore;
  }

  return store;
}

export async function getCachedPrep(
  jobDescription: string,
  role: InterviewRole,
): Promise<PrepCacheEntry | null> {
  const key = buildPrepCacheKey(jobDescription, role);
  const store = await readStore();
  const entry = store[key];

  if (!entry || !isValidEntry(entry) || isExpired(entry)) {
    return null;
  }

  return entry;
}

export async function setCachedPrep(
  request: InterviewPrepRequest,
  result: InterviewPrepResult,
): Promise<void> {
  const key = buildPrepCacheKey(request.jobDescription, request.role);
  const store = await readStore();

  const entry: PrepCacheEntry = {
    key,
    jobDescription: request.jobDescription.trim(),
    role: request.role,
    result,
    cachedAt: new Date().toISOString(),
  };

  const nextEntries = [entry, ...Object.values(store).filter((item) => item.key !== key)]
    .sort((a, b) => new Date(b.cachedAt).getTime() - new Date(a.cachedAt).getTime())
    .slice(0, MAX_PREP_CACHE_ENTRIES);

  const nextStore = Object.fromEntries(nextEntries.map((item) => [item.key, item]));
  await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(nextStore));
}
