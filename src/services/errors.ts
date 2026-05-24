export type GeminiErrorCode =
  | 'MISSING_API_KEY'
  | 'NETWORK_ERROR'
  | 'API_ERROR'
  | 'EMPTY_RESPONSE'
  | 'PARSE_ERROR'
  | 'VALIDATION_ERROR'
  | 'TIMEOUT'
  | 'COOLDOWN';

const USER_MESSAGES: Record<GeminiErrorCode, string> = {
  MISSING_API_KEY:
    'Gemini API key is not configured. Add EXPO_PUBLIC_GEMINI_API_KEY to your .env file.',
  NETWORK_ERROR: 'Network error. Check your connection and try again.',
  API_ERROR: 'The AI service returned an error. Please try again in a moment.',
  EMPTY_RESPONSE: 'The AI returned an empty response. Please try again.',
  PARSE_ERROR: 'Could not read the AI response. Please try again.',
  VALIDATION_ERROR: 'The AI response was incomplete. Please try again.',
  TIMEOUT: 'The request timed out. Please try again.',
  COOLDOWN: 'Please wait a moment before generating again.',
};

function formatUserMessage(code: GeminiErrorCode, message?: string): string {
  const detail = message?.trim();
  if (!detail) return USER_MESSAGES[code];

  if (code === 'API_ERROR') {
    const lower = detail.toLowerCase();

    if (lower.includes('api key') || lower.includes('api_key_invalid')) {
      return 'Invalid Gemini API key. Update EXPO_PUBLIC_GEMINI_API_KEY in .env and restart Expo.';
    }

    if (lower.includes('not found') && lower.includes('model')) {
      return 'Gemini model not found. Set EXPO_PUBLIC_GEMINI_MODEL=gemini-2.0-flash in .env and restart Expo.';
    }

    if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('resource_exhausted')) {
      return 'Gemini quota exceeded. Wait a few minutes or check billing in Google AI Studio.';
    }

    return detail.length > 220 ? `${detail.slice(0, 220)}...` : detail;
  }

  if (code === 'COOLDOWN') {
    return detail || USER_MESSAGES.COOLDOWN;
  }

  return detail;
}

export class GeminiServiceError extends Error {
  readonly code: GeminiErrorCode;
  readonly userMessage: string;

  constructor(code: GeminiErrorCode, message?: string, options?: { cause?: unknown }) {
    const userMessage = formatUserMessage(code, message);
    super(userMessage, options);
    this.name = 'GeminiServiceError';
    this.code = code;
    this.userMessage = userMessage;
  }
}

export function isQuotaOrRateLimitError(error: unknown): boolean {
  if (!(error instanceof GeminiServiceError)) return false;

  const message = `${error.message} ${error.userMessage}`.toLowerCase();
  return (
    message.includes('quota') ||
    message.includes('rate limit') ||
    message.includes('resource_exhausted') ||
    message.includes('429')
  );
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof GeminiServiceError) {
    return error.userMessage;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'Something went wrong. Please try again.';
}
