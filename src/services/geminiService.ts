import { getGeminiApiKey, getGeminiModelCandidates, requireGeminiApiKey } from '@/config/env';
import { ROLE_OPTIONS } from '@/constants/roles';
import type { InterviewRole } from '@/types/interview';
import type {
  GeminiGenerateContentResponse,
  GeminiPrepRequest,
  GeminiPrepResponse,
} from '@/types/gemini';
import { parseGeminiPrepResponse } from '@/utils/parseGeminiResponse';

import { GeminiServiceError } from './errors';

const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const REQUEST_TIMEOUT_MS = 60_000;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    technicalQuestions: {
      type: 'array',
      items: { type: 'string' },
      description: 'Role-specific technical interview questions',
    },
    hrQuestions: {
      type: 'array',
      items: { type: 'string' },
      description: 'Behavioral and HR interview questions',
    },
    dsaTopics: {
      type: 'array',
      items: { type: 'string' },
      description: 'Data structures and algorithms topics to study',
    },
    resumeImprovements: {
      type: 'array',
      items: { type: 'string' },
      description: 'Actionable resume improvement suggestions',
    },
    projectSuggestions: {
      type: 'array',
      items: { type: 'string' },
      description: 'Portfolio project ideas aligned with the job',
    },
  },
  required: [
    'technicalQuestions',
    'hrQuestions',
    'dsaTopics',
    'resumeImprovements',
    'projectSuggestions',
  ],
} as const;

function buildPrompt({ jobDescription, roleLabel }: GeminiPrepRequest): string {
  return `You are an expert technical interview coach.

Given the job description and target role below, produce a tailored interview preparation plan.

Target role: ${roleLabel}

Job description:
"""
${jobDescription}
"""

Requirements:
- Return ONLY valid JSON matching the provided schema.
- Provide exactly 5 items per array.
- Make every item specific to the job description and role (mention relevant tech, skills, or responsibilities when possible).
- Technical questions should match seniority implied by the posting.
- HR questions should be behavioral (STAR-friendly).
- DSA topics should be the most likely topics for this role level.
- Resume suggestions must be actionable edits, not generic advice.
- Project suggestions should be realistic portfolio builds for this candidate profile.`;
}

function getRoleLabel(role: InterviewRole): string {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label ?? role;
}

function extractResponseText(payload: GeminiGenerateContentResponse): string {
  const text = payload.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!text) {
    throw new GeminiServiceError('EMPTY_RESPONSE');
  }

  return text;
}

function isModelNotFoundError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes('not found') && lower.includes('model');
}

function buildRequestBody(jobDescription: string, roleLabel: string) {
  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: buildPrompt({ jobDescription, roleLabel }) }],
      },
    ],
    generationConfig: {
      temperature: 0.6,
      responseMimeType: 'application/json',
      responseSchema: RESPONSE_SCHEMA,
    },
  };
}

async function requestGeminiModel(
  apiKey: string,
  model: string,
  jobDescription: string,
  roleLabel: string,
): Promise<GeminiPrepResponse> {
  const url = `${GEMINI_API_BASE}/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(buildRequestBody(jobDescription, roleLabel)),
    });

    const payload = (await response.json()) as GeminiGenerateContentResponse;

    if (!response.ok) {
      const apiMessage = payload.error?.message ?? `HTTP ${response.status}`;
      throw new GeminiServiceError('API_ERROR', apiMessage);
    }

    if (payload.error?.message) {
      throw new GeminiServiceError('API_ERROR', payload.error.message);
    }

    const rawText = extractResponseText(payload);
    return parseGeminiPrepResponse(rawText);
  } catch (error) {
    if (error instanceof GeminiServiceError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new GeminiServiceError('TIMEOUT');
    }

    throw new GeminiServiceError(
      'NETWORK_ERROR',
      error instanceof Error ? error.message : undefined,
      { cause: error },
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

export function isGeminiConfigured(): boolean {
  return Boolean(getGeminiApiKey());
}

export async function generatePrepWithGemini(
  jobDescription: string,
  role: InterviewRole,
): Promise<GeminiPrepResponse> {
  const apiKey = requireGeminiApiKey();
  const roleLabel = getRoleLabel(role);
  const models = getGeminiModelCandidates();

  let lastModelError: GeminiServiceError | null = null;

  for (const model of models) {
    try {
      return await requestGeminiModel(apiKey, model, jobDescription, roleLabel);
    } catch (error) {
      if (
        error instanceof GeminiServiceError &&
        error.code === 'API_ERROR' &&
        isModelNotFoundError(error.message)
      ) {
        lastModelError = error;
        continue;
      }

      throw error;
    }
  }

  throw (
    lastModelError ??
    new GeminiServiceError(
      'API_ERROR',
      'No supported Gemini model is available for this API key.',
    )
  );
}
