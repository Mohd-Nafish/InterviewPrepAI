const DEFAULT_GEMINI_MODEL = 'gemini-2.0-flash';

const PLACEHOLDER_KEY_MARKERS = [
  'your_gemini_api_key_here',
  'your_api_key_here',
  'your_key_here',
  'paste_your_key',
];

export function getGeminiApiKey(): string | undefined {
  const key = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();
  if (!key || key.length === 0) return undefined;

  const normalized = key.toLowerCase();
  if (PLACEHOLDER_KEY_MARKERS.some((marker) => normalized.includes(marker))) {
    return undefined;
  }

  return key;
}

export function getGeminiModel(): string {
  const model = process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim();
  return model && model.length > 0 ? model : DEFAULT_GEMINI_MODEL;
}

export function getGeminiModelCandidates(): string[] {
  const preferred = getGeminiModel();
  const fallbacks = ['gemini-2.0-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b'];

  return [preferred, ...fallbacks].filter(
    (model, index, models) => models.indexOf(model) === index,
  );
}

export function requireGeminiApiKey(): string {
  const key = getGeminiApiKey();
  if (!key) {
    throw new Error(
      'Missing EXPO_PUBLIC_GEMINI_API_KEY. Add it to a .env file and restart Expo.',
    );
  }
  return key;
}

export function isMockModeEnabled(): boolean {
  const value = process.env.EXPO_PUBLIC_USE_MOCK_AI?.trim().toLowerCase();
  return value === 'true' || value === '1' || value === 'yes';
}
