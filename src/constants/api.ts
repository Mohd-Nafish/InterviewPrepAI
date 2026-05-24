/** Minimum wait between live Gemini API calls (ms). */
export const GENERATE_COOLDOWN_MS = 30_000;

/** How long cached prep results stay valid (ms). */
export const PREP_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

/** Max cached prep entries stored locally. */
export const MAX_PREP_CACHE_ENTRIES = 40;
