/**
 * Token canonicalization for bilingual search with spelling correction.
 * Maps common misspellings and Tamil/English synonyms to canonical forms.
 */

// Spelling correction map: misspelling → correct form
const SPELLING_CORRECTIONS: Record<string, string> = {
  // User-provided corrections
  'plambur': 'plumber',
  'plambr': 'plumber',
  'plumer': 'plumber',
  'plumbr': 'plumber',
  'wellding': 'welding',
  'weldig': 'welding',
  'acricuthur': 'agriculture',
  'agricuthur': 'agriculture',
  'agrikultur': 'agriculture',
  
  // Additional common misspellings
  'electrisian': 'electrician',
  'electrition': 'electrician',
  'carpanter': 'carpenter',
  'carpeter': 'carpenter',
  'thindivanam': 'tindivanam',
  'tindivanm': 'tindivanam',
  'tindivanum': 'tindivanam',
  'pondy': 'pondicherry',
  'mailam': 'mailam',
  'mailamla': 'mailam', // Location suffix variant
  'samayal': 'cooking',
  'samaiyal': 'cooking',
  'tayler': 'tailor',
  'taylr': 'tailor',
  'masan': 'mason',
  'masen': 'mason',
  'paynter': 'painter',
  'paintr': 'painter',
};

// Tamil to English synonym map
const TAMIL_ENGLISH_SYNONYMS: Record<string, string> = {
  // Tamil words (transliterated)
  'பிளம்பர்': 'plumber',
  'plumbar': 'plumber',
  'சமையல்': 'cooking',
  'samayal': 'cooking',
  'samaiyal': 'cooking',
  'மின்சாரம்': 'electrician',
  'minsaram': 'electrician',
  'electric': 'electrician',
  'தையல்': 'tailoring',
  'thayal': 'tailoring',
  'taiyal': 'tailoring',
  'வேலை': 'work',
  'velai': 'work',
  'வேண்டும்': 'need',
  'venum': 'need',
  'venuma': 'need',
  'இருக்கா': 'available',
  'irukana': 'available',
  'iruka': 'available',
  'irukka': 'available',
  'தேவை': 'need',
  'thevai': 'need',
  'aunty': 'helper',
  'anna': 'helper',
  'nalaiku': 'tomorrow', // temporal, filtered as stopword
};

// Stopwords to remove (not useful for matching)
export const STOPWORDS = new Set([
  // English
  'or', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'near', 'me', 'please', 'needed', 'want', 'need',
  // Work-related words that are not actual skills
  'work', 'worker', 'service', 'repair',
  // Tamil/transliterated spoken helpers
  'venum', 'venuma', 'venumpa', 'venumo', 'irukana', 'iruka', 'irukka', 'velai',
  'தேவை', 'வேண்டும்', 'இருக்கா',
  // Honorifics
  'aunty', 'auntie', 'anna', 'akka', 'bro', 'sir', 'madam',
  // Temporal words
  'nalaiku', 'tomorrow', 'today', 'now',
  // Location suffixes (handled separately)
  'la', 'le', 'il', 'ல', 'லே',
]);

/**
 * Normalize text for canonicalization (lowercase, trim, preserve Tamil characters)
 */
function normalizeToken(token: string): string {
  return token.toLowerCase().trim();
}

/**
 * Canonicalize a single token: apply spelling correction and synonym mapping
 */
export function canonicalizeToken(token: string): string {
  const normalized = normalizeToken(token);
  
  // Check spelling corrections first
  if (SPELLING_CORRECTIONS[normalized]) {
    return SPELLING_CORRECTIONS[normalized];
  }
  
  // Check Tamil/English synonyms
  if (TAMIL_ENGLISH_SYNONYMS[normalized]) {
    return TAMIL_ENGLISH_SYNONYMS[normalized];
  }
  
  // Return normalized token as-is
  return normalized;
}

/**
 * Check if a token is a stopword
 */
export function isStopword(token: string): boolean {
  return STOPWORDS.has(normalizeToken(token));
}

/**
 * Canonicalize an array of tokens
 */
export function canonicalizeTokens(tokens: string[]): string[] {
  return tokens
    .filter(token => !isStopword(token))
    .map(token => canonicalizeToken(token))
    .filter(token => token.length > 0);
}
