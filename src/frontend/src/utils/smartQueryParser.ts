/**
 * Smart bilingual sentence query parser for Tamil and English.
 * Extracts structured signals: locations, skills/tags, categories.
 */

import { canonicalizeToken, canonicalizeTokens, isStopword } from './tokenCanonicalization';

// Known location keywords
const LOCATION_KEYWORDS = new Set([
  'tindivanam', 'thindivanam', 'mailam', 'pondy', 'pondicherry', 'puducherry',
  'chennai', 'villupuram', 'cuddalore', 'gingee', 'vikravandi',
  'nearby', 'near', 'nearme',
]);

// Known skill/work keywords (after canonicalization)
const SKILL_KEYWORDS = new Set([
  'plumber', 'electrician', 'painter', 'carpenter', 'maid', 'cook', 'cooking',
  'driver', 'mechanic', 'welder', 'mason', 'helper', 'cleaner', 'cleaning',
  'tailor', 'tailoring', 'barber', 'beautician', 'security', 'guard', 'labour', 'labor',
  'ac', 'painting', 'welding', 'stitching', 'stitch', 'blouse',
  'saree', 'falls', 'pico', 'aari', 'ironing',
  'farm', 'agriculture', 'harvest', 'planting', 'sprayer',
  'construction', 'building', 'masonry', 'carpentry',
  'transport', 'truck', 'vehicle',
  'event', 'catering', 'decoration',
]);

// Known category keywords
const CATEGORY_KEYWORDS = new Set([
  'construction', 'agriculture', 'home services', 'homeservices',
  'transport', 'events', 'cooking', 'daily helpers', 'dailyhelpers',
  'repairs', 'supplies', 'tailoring', 'local skilled workers',
]);

export interface ParsedQuery {
  raw: string;
  tokens: string[];
  canonicalTokens: string[];
  locations: string[];
  skills: string[];
  categories: string[];
}

/**
 * Tokenize text while preserving Tamil characters
 */
function tokenize(text: string): string[] {
  // Split on whitespace and common punctuation, but preserve Tamil characters
  return text
    .toLowerCase()
    .replace(/[,;.!?()]/g, ' ')
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);
}

/**
 * Parse a bilingual sentence query into structured signals
 */
export function parseQuery(query: string): ParsedQuery {
  const raw = query.trim();
  const tokens = tokenize(raw);
  
  // Remove stopwords and canonicalize
  const canonicalTokens = canonicalizeTokens(tokens);
  
  // Extract locations
  const locations: string[] = [];
  for (const token of canonicalTokens) {
    if (LOCATION_KEYWORDS.has(token)) {
      locations.push(token);
    }
  }
  
  // Extract skills
  const skills: string[] = [];
  for (const token of canonicalTokens) {
    if (SKILL_KEYWORDS.has(token)) {
      skills.push(token);
    }
  }
  
  // Extract categories (multi-word support)
  const categories: string[] = [];
  const joinedTokens = canonicalTokens.join(' ');
  for (const category of CATEGORY_KEYWORDS) {
    if (joinedTokens.includes(category)) {
      categories.push(category);
    }
  }
  
  return {
    raw,
    tokens,
    canonicalTokens,
    locations,
    skills,
    categories,
  };
}
