import type { GeminiPrepResponse } from '@/types/gemini';

import { GeminiServiceError } from '@/services/errors';

const REQUIRED_KEYS: (keyof GeminiPrepResponse)[] = [
  'technicalQuestions',
  'hrQuestions',
  'dsaTopics',
  'resumeImprovements',
  'projectSuggestions',
];

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((item) => typeof item === 'string' && item.trim().length > 0)
  );
}

function normalizeStringArray(items: string[]): string[] {
  return items.map((item) => item.trim()).filter(Boolean);
}

export function extractJsonPayload(rawText: string): string {
  const trimmed = rawText.trim();

  if (trimmed.startsWith('{')) {
    return trimmed;
  }

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    return fenced[1].trim();
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }

  return trimmed;
}

export function parseGeminiPrepResponse(rawText: string): GeminiPrepResponse {
  let parsed: unknown;

  try {
    const jsonPayload = extractJsonPayload(rawText);
    parsed = JSON.parse(jsonPayload);
  } catch {
    throw new GeminiServiceError(
      'PARSE_ERROR',
      'Failed to parse Gemini JSON response.',
    );
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new GeminiServiceError('VALIDATION_ERROR', 'Gemini response is not an object.');
  }

  const record = parsed as Record<string, unknown>;
  const result = {} as GeminiPrepResponse;

  for (const key of REQUIRED_KEYS) {
    const value = record[key];

    if (!isStringArray(value)) {
      throw new GeminiServiceError(
        'VALIDATION_ERROR',
        `Gemini response field "${key}" is missing or invalid.`,
      );
    }

    result[key] = normalizeStringArray(value);
  }

  return result;
}
