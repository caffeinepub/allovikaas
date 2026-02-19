/**
 * Frontend query normalization for intent-based search.
 * Handles spoken Tamil helper words, suffix-attached locations, and common variations.
 */

// Common spoken Tamil helper words to strip (not useful for backend intent extraction)
const SPOKEN_TAMIL_HELPERS = new Set([
  'irukka', 'irukana', 'iruka', 'irukkana',
  'venum', 'venuma', 'venumpa', 'venumo',
  'work', 'worker', 'venum pa',
  'la', 'le', 'il', 'ல', 'லே', 'இல்',
]);

// Location suffix patterns (e.g., "mailamla" → "mailam")
const LOCATION_SUFFIX_PATTERNS = [
  { pattern: /la$/i, replacement: '' },
  { pattern: /le$/i, replacement: '' },
  { pattern: /il$/i, replacement: '' },
  { pattern: /ல$/i, replacement: '' },
  { pattern: /லே$/i, replacement: '' },
];

// Skill/work keyword mappings for better extraction
const SKILL_MAPPINGS: Record<string, string> = {
  'samayal': 'cooking',
  'samaiyal': 'cooking',
  'aunty': 'cooking helper',
  'nalaiku': '', // temporal word, not a skill
  'tomorrow': '',
  'today': '',
  'now': '',
};

/**
 * Normalize a query before sending to backend intent search.
 * Strips spoken Tamil helpers, normalizes location suffixes, and cleans whitespace.
 */
export function normalizeIntentQuery(query: string): string {
  if (!query || typeof query !== 'string') {
    return '';
  }

  let normalized = query.trim().toLowerCase();

  // Split into tokens
  const tokens = normalized.split(/\s+/);

  // Process tokens
  const processedTokens = tokens
    .map(token => {
      // Skip spoken Tamil helpers
      if (SPOKEN_TAMIL_HELPERS.has(token)) {
        return '';
      }

      // Apply skill mappings
      if (SKILL_MAPPINGS[token] !== undefined) {
        return SKILL_MAPPINGS[token];
      }

      // Try to normalize location suffixes
      let processedToken = token;
      for (const { pattern, replacement } of LOCATION_SUFFIX_PATTERNS) {
        if (pattern.test(processedToken)) {
          processedToken = processedToken.replace(pattern, replacement);
          break;
        }
      }

      return processedToken;
    })
    .filter(token => token.length > 0);

  // Rejoin and normalize whitespace
  return processedTokens.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Normalize a prefix for live suggestions (less aggressive than full query normalization).
 * Only removes obvious noise words but preserves partial typing.
 */
export function normalizeSuggestionPrefix(prefix: string): string {
  if (!prefix || typeof prefix !== 'string') {
    return '';
  }

  let normalized = prefix.trim().toLowerCase();

  // Only remove trailing spoken helpers if they're complete words
  const tokens = normalized.split(/\s+/);
  const lastToken = tokens[tokens.length - 1];

  // If last token is a complete spoken helper, remove it
  if (SPOKEN_TAMIL_HELPERS.has(lastToken)) {
    tokens.pop();
    normalized = tokens.join(' ');
  }

  return normalized.replace(/\s+/g, ' ').trim();
}
