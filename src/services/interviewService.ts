import { GENERATE_COOLDOWN_MS } from '@/constants/api';
import { isMockModeEnabled } from '@/config/env';
import type { InterviewPrepRequest, InterviewPrepResult } from '@/types/interview';

import { getLastApiCallAt } from './apiUsageStorage';
import { GeminiServiceError, isQuotaOrRateLimitError } from './errors';
import { generatePrepWithGemini, isGeminiConfigured } from './geminiService';
import { generateMockInterviewPrep } from './mockInterviewService';
import { getCachedPrep, setCachedPrep } from './prepCacheStorage';

export type GenerateSource = 'mock' | 'cache' | 'api' | 'fallback';

export type GenerateInterviewPrepResult = {
  result: InterviewPrepResult;
  source: GenerateSource;
  /** Non-blocking info when Gemini was skipped (e.g. quota). */
  notice?: string;
};

function getCooldownRemainingMs(lastApiCallAt: number | null): number {
  if (!lastApiCallAt) return 0;
  const elapsed = Date.now() - lastApiCallAt;
  return Math.max(0, GENERATE_COOLDOWN_MS - elapsed);
}

async function assertApiCooldownAllowed(): Promise<void> {
  const lastApiCallAt = await getLastApiCallAt();
  const remainingMs = getCooldownRemainingMs(lastApiCallAt);

  if (remainingMs > 0) {
    const seconds = Math.ceil(remainingMs / 1000);
    throw new GeminiServiceError(
      'COOLDOWN',
      `Please wait ${seconds}s before generating again.`,
    );
  }
}

async function buildResultFromGemini(
  request: InterviewPrepRequest,
): Promise<InterviewPrepResult> {
  const prep = await generatePrepWithGemini(request.jobDescription, request.role);

  return {
    jobTitle: extractJobTitle(request.jobDescription),
    role: request.role,
    technicalQuestions: prep.technicalQuestions,
    hrQuestions: prep.hrQuestions,
    dsaTopics: prep.dsaTopics,
    resumeImprovements: prep.resumeImprovements,
    projectSuggestions: prep.projectSuggestions,
  };
}

export async function generateInterviewPrep(
  request: InterviewPrepRequest,
  options?: { skipCache?: boolean },
): Promise<GenerateInterviewPrepResult> {
  if (isMockModeEnabled()) {
    const result = await generateMockInterviewPrep(request);
    await setCachedPrep(request, result).catch(() => null);
    return { result, source: 'mock' };
  }

  if (!options?.skipCache) {
    const cached = await getCachedPrep(request.jobDescription, request.role);
    if (cached) {
      return { result: cached.result, source: 'cache' };
    }
  }

  if (!isGeminiConfigured()) {
    throw new GeminiServiceError(
      'MISSING_API_KEY',
      'Add a valid EXPO_PUBLIC_GEMINI_API_KEY to .env (not the placeholder), then restart Expo.',
    );
  }

  await assertApiCooldownAllowed();

  try {
    const result = await buildResultFromGemini(request);
    await setCachedPrep(request, result).catch(() => null);
    return { result, source: 'api' };
  } catch (error) {
    if (isQuotaOrRateLimitError(error)) {
      const result = await generateMockInterviewPrep(request);
      await setCachedPrep(request, result).catch(() => null);
      return {
        result,
        source: 'fallback',
        notice:
          'Gemini quota is exceeded. Showing a sample prep plan so you can keep using the app. Try again later for AI-generated content.',
      };
    }

    throw error;
  }
}

function extractJobTitle(jobDescription: string): string {
  const firstLine = jobDescription.trim().split('\n')[0]?.trim();
  if (!firstLine) return 'Interview Prep';
  return firstLine.length > 60 ? `${firstLine.slice(0, 57)}...` : firstLine;
}
