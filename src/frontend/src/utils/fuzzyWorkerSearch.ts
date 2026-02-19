/**
 * Centralized fuzzy matching and normalization utilities for worker search.
 * Provides typo-tolerant matching across name, area, category, and skills.
 * Updated to be Tamil-safe (preserve non-Latin characters).
 */

/**
 * Normalize text for search: lowercase, trim, collapse whitespace
 * Tamil-safe: does NOT remove non-Latin characters
 */
export function normalizeForSearch(text: string | undefined | null): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\u0B80-\u0BFF]/g, '') // Remove punctuation but preserve Tamil Unicode range
    .replace(/\s+/g, ' ') // Collapse whitespace
    .trim();
}

/**
 * Tokenize normalized text into words
 */
export function tokenizeForSearch(text: string): string[] {
  const normalized = normalizeForSearch(text);
  if (!normalized) return [];
  return normalized.split(' ').filter(token => token.length > 0);
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching with typo tolerance
 */
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Calculate similarity ratio between two strings (0-1)
 * 1 = identical, 0 = completely different
 */
function similarityRatio(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  const distance = levenshteinDistance(a, b);
  return 1 - distance / maxLen;
}

/**
 * Check if two tokens are fuzzy matches
 * Returns true if they are similar enough (accounting for typos)
 */
export function isFuzzyMatch(queryToken: string, candidateToken: string, threshold: number = 0.75): boolean {
  if (!queryToken || !candidateToken) return false;

  const normalizedQuery = normalizeForSearch(queryToken);
  const normalizedCandidate = normalizeForSearch(candidateToken);

  if (!normalizedQuery || !normalizedCandidate) return false;

  // Exact match
  if (normalizedQuery === normalizedCandidate) return true;

  // Substring match
  if (normalizedCandidate.includes(normalizedQuery) || normalizedQuery.includes(normalizedCandidate)) {
    return true;
  }

  // Fuzzy match using similarity ratio
  const similarity = similarityRatio(normalizedQuery, normalizedCandidate);
  return similarity >= threshold;
}

/**
 * Check if a query token fuzzy-matches any token in a field
 */
export function fuzzyFieldMatch(
  queryToken: string,
  fieldValue: string | undefined | null,
  threshold: number = 0.75
): boolean {
  if (!queryToken || !fieldValue) return false;

  const fieldTokens = tokenizeForSearch(fieldValue);
  const normalizedQuery = normalizeForSearch(queryToken);

  if (!normalizedQuery) return false;

  // Check if any field token matches the query token
  return fieldTokens.some(fieldToken => isFuzzyMatch(normalizedQuery, fieldToken, threshold));
}

/**
 * Check if a query token fuzzy-matches any item in an array field (e.g., skills)
 */
export function fuzzyArrayFieldMatch(
  queryToken: string,
  arrayField: string[] | undefined | null,
  threshold: number = 0.75
): boolean {
  if (!queryToken || !arrayField || !Array.isArray(arrayField)) return false;

  const normalizedQuery = normalizeForSearch(queryToken);
  if (!normalizedQuery) return false;

  // Check if any array item matches the query token
  return arrayField.some(item => fuzzyFieldMatch(normalizedQuery, item, threshold));
}

/**
 * Calculate fuzzy relevance score for a worker based on query
 * Higher score = more relevant
 */
export function calculateFuzzyRelevanceScore(
  worker: {
    name?: string;
    area?: string;
    category?: string;
    skills?: string[];
  },
  query: string,
  threshold: number = 0.75
): number {
  const queryTokens = tokenizeForSearch(query);
  if (queryTokens.length === 0) return 0;

  let score = 0;

  for (const queryToken of queryTokens) {
    // Name match (highest priority)
    if (fuzzyFieldMatch(queryToken, worker.name, threshold)) {
      score += 100;
    }

    // Area match (high priority)
    if (fuzzyFieldMatch(queryToken, worker.area, threshold)) {
      score += 50;
    }

    // Category match (medium priority)
    if (fuzzyFieldMatch(queryToken, worker.category, threshold)) {
      score += 30;
    }

    // Skills match (medium priority)
    if (fuzzyArrayFieldMatch(queryToken, worker.skills, threshold)) {
      score += 20;
    }
  }

  return score;
}

/**
 * Check if a worker matches a fuzzy search query
 * Returns true if any field matches any query token
 */
export function workerMatchesFuzzyQuery(
  worker: {
    name?: string;
    area?: string;
    category?: string;
    skills?: string[];
  },
  query: string,
  threshold: number = 0.75
): boolean {
  const queryTokens = tokenizeForSearch(query);
  if (queryTokens.length === 0) return false;

  // Check if any query token matches any field
  return queryTokens.some(queryToken => {
    return (
      fuzzyFieldMatch(queryToken, worker.name, threshold) ||
      fuzzyFieldMatch(queryToken, worker.area, threshold) ||
      fuzzyFieldMatch(queryToken, worker.category, threshold) ||
      fuzzyArrayFieldMatch(queryToken, worker.skills, threshold)
    );
  });
}
