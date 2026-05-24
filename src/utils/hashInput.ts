export function hashInput(value: string): string {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash).toString(36);
}

export function buildPrepCacheKey(jobDescription: string, role: string): string {
  const normalized = `${role}::${jobDescription.trim().toLowerCase().replace(/\s+/g, ' ')}`;
  return `prep_${hashInput(normalized)}`;
}
