/** Structured prep content returned by Gemini (JSON). */
export type GeminiPrepResponse = {
  technicalQuestions: string[];
  hrQuestions: string[];
  dsaTopics: string[];
  resumeImprovements: string[];
  projectSuggestions: string[];
};

/** Gemini REST `generateContent` response (partial). */
export type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
    finishReason?: string;
  }>;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

export type GeminiPrepRequest = {
  jobDescription: string;
  roleLabel: string;
};
