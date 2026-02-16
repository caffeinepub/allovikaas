/**
 * Lightweight natural-language search helper for Tamil and English.
 * Extracts skill keywords and location words, and provides matching/scoring
 * against worker.skills, worker.category, and worker.area.
 * Now uses fuzzy matching for typo tolerance.
 */

import { normalizeForSearch, tokenizeForSearch, isFuzzyMatch, fuzzyFieldMatch, fuzzyArrayFieldMatch } from './fuzzyWorkerSearch';

// Common skill keywords in English and Tamil
const SKILL_KEYWORDS = [
  // English
  'plumber', 'electrician', 'painter', 'carpenter', 'maid', 'cook', 'cooking',
  'driver', 'mechanic', 'welder', 'mason', 'helper', 'cleaner', 'cleaning',
  'tailor', 'barber', 'beautician', 'security', 'guard', 'labour', 'labor',
  'ac', 'repair', 'painting', 'work', 'worker', 'aunty', 'auntie',
  // Tamil transliterations
  'plumber', 'electrician', 'painter', 'carpenter', 'velai', 'venum',
  'irukana', 'iruka', 'velaikkaran', 'thozhilali',
];

// Common location/area keywords
const LOCATION_KEYWORDS = [
  'near', 'me', 'area', 'tindivanam', 'pondicherry', 'puducherry',
  'chennai', 'villupuram', 'cuddalore', 'gingee', 'vikravandi',
];

/**
 * Extract potential skill keywords from query using fuzzy matching
 */
export function extractSkillKeywords(query: string): string[] {
  const tokens = tokenizeForSearch(query);
  const skills: string[] = [];
  
  // Check each token against skill keywords with fuzzy matching
  for (const token of tokens) {
    // Check if token fuzzy-matches any skill keyword
    const matchedKeyword = SKILL_KEYWORDS.find(keyword => isFuzzyMatch(token, keyword, 0.75));
    if (matchedKeyword) {
      skills.push(token);
    }
  }
  
  // Also extract common patterns with fuzzy matching
  const normalized = normalizeForSearch(query);
  
  if (isFuzzyMatch(normalized, 'ac', 0.75) || normalized.includes('air condition')) {
    skills.push('ac');
  }
  if (isFuzzyMatch(normalized, 'cook', 0.75)) {
    skills.push('cooking');
  }
  if (isFuzzyMatch(normalized, 'paint', 0.75)) {
    skills.push('painter');
  }
  if (isFuzzyMatch(normalized, 'plumb', 0.75)) {
    skills.push('plumber');
  }
  if (isFuzzyMatch(normalized, 'electric', 0.75)) {
    skills.push('electrician');
  }
  if (isFuzzyMatch(normalized, 'carpent', 0.75)) {
    skills.push('carpenter');
  }
  if (isFuzzyMatch(normalized, 'weld', 0.75)) {
    skills.push('welder');
  }
  if (isFuzzyMatch(normalized, 'mason', 0.75) || isFuzzyMatch(normalized, 'brick', 0.75)) {
    skills.push('mason');
  }
  if (isFuzzyMatch(normalized, 'clean', 0.75)) {
    skills.push('cleaning');
  }
  if (isFuzzyMatch(normalized, 'tailor', 0.75) || isFuzzyMatch(normalized, 'stitch', 0.75)) {
    skills.push('tailor');
  }
  
  return [...new Set(skills)]; // deduplicate
}

/**
 * Extract potential location keywords from query using fuzzy matching
 */
export function extractLocationKeywords(query: string): string[] {
  const tokens = tokenizeForSearch(query);
  const locations: string[] = [];
  
  for (const token of tokens) {
    // Check if token fuzzy-matches any location keyword
    const matchedKeyword = LOCATION_KEYWORDS.find(keyword => isFuzzyMatch(token, keyword, 0.75));
    if (matchedKeyword) {
      locations.push(token);
    }
  }
  
  return [...new Set(locations)]; // deduplicate
}

/**
 * Score a worker against extracted keywords using fuzzy matching
 */
export function scoreWorkerMatch(
  worker: { skills: string[]; category: string; area: string },
  skillKeywords: string[],
  locationKeywords: string[]
): number {
  let score = 0;
  
  // Match skills with fuzzy matching
  for (const keyword of skillKeywords) {
    // Check category
    if (fuzzyFieldMatch(keyword, worker.category, 0.75)) {
      score += 10;
    }
    
    // Check skills
    if (fuzzyArrayFieldMatch(keyword, worker.skills, 0.75)) {
      score += 5;
    }
  }
  
  // Match location with fuzzy matching
  for (const keyword of locationKeywords) {
    if (fuzzyFieldMatch(keyword, worker.area, 0.75)) {
      score += 3;
    }
  }
  
  // Fallback: if no specific keywords matched, do a general fuzzy text match
  if (score === 0 && (skillKeywords.length > 0 || locationKeywords.length > 0)) {
    const allKeywords = [...skillKeywords, ...locationKeywords];
    
    for (const keyword of allKeywords) {
      // Check if keyword fuzzy-matches category, skills, or area
      if (fuzzyFieldMatch(keyword, worker.category, 0.75)) {
        score += 2;
      }
      
      if (fuzzyArrayFieldMatch(keyword, worker.skills, 0.75)) {
        score += 1;
      }
      
      if (fuzzyFieldMatch(keyword, worker.area, 0.75)) {
        score += 1;
      }
    }
  }
  
  return score;
}

/**
 * Match and rank workers based on natural language query with fuzzy matching
 */
export function matchWorkers<T extends { skills: string[]; category: string; area: string }>(
  workers: T[],
  query: string,
  limit: number = 10
): T[] {
  if (!query.trim()) {
    return [];
  }
  
  const skillKeywords = extractSkillKeywords(query);
  const locationKeywords = extractLocationKeywords(query);
  
  // If no keywords extracted, do a simple fuzzy text search
  if (skillKeywords.length === 0 && locationKeywords.length === 0) {
    const queryTokens = tokenizeForSearch(query);
    return workers
      .filter(worker => {
        // Check if any query token fuzzy-matches any worker field
        return queryTokens.some(token => 
          fuzzyFieldMatch(token, worker.category, 0.75) ||
          fuzzyFieldMatch(token, worker.area, 0.75) ||
          fuzzyArrayFieldMatch(token, worker.skills, 0.75)
        );
      })
      .slice(0, limit);
  }
  
  // Score and sort workers using fuzzy matching
  const scoredWorkers = workers
    .map(worker => ({
      worker,
      score: scoreWorkerMatch(worker, skillKeywords, locationKeywords),
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);
  
  return scoredWorkers.slice(0, limit).map(item => item.worker);
}
