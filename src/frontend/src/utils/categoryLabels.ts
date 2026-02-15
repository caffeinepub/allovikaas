/**
 * Strict Category Label Mapping System
 * 
 * This module provides the single source of truth for category slug → display label mappings.
 * 
 * RULES:
 * 1. UI must NEVER show raw slug
 * 2. If slug not found → show capitalized words (fallback)
 * 3. Apply mapping everywhere: category cards, search results, worker profile, suggestions, filters
 * 4. Database values remain unchanged - this is display-only
 */

// Strict category slug → human-readable label mapping
export const CATEGORY_LABELS: Record<string, string> = {
  // User-provided mappings (exact)
  'construction': 'Construction',
  'agriculture': 'Agriculture',
  'homeservices': 'Home Services',
  'transport': 'Transport',
  'homeimprovement': 'Home Improvement',
  'specializedcleaning': 'Specialized Cleaning',
  'generalservices': 'General Services',
  'woodmetal': 'Wood & Metal Works',
  'treework': 'Tree Cutting & Coconut Climbing',
  'householdservices': 'Household Services',
  'vehicleservices': 'Vehicle Services',
  'tailoring': 'Tailoring',
  'aariwork': 'Aari Work',
  'catering': 'Cooking / Catering',
  'eventservices': 'Event Services',
  'printing': 'Printing & Flex',
  'repair': 'Repair Services',
  'electrical': 'Electrical',
  'plumbing': 'Plumbing',
  'painting': 'Painting',
  'carpenter': 'Carpentry',
  'welding': 'Welding',
  
  // Additional known categories (with spaces)
  'home services': 'Home Services',
  'dailyhelpers': 'Daily Helpers',
  'daily helpers': 'Daily Helpers',
  'eventwork': 'Event Services',
  'events & cooking': 'Event Services',
  'eventscooking': 'Event Services',
  'repairs': 'Repair Services',
  'supplies': 'Supplies',
  'localskilledworkers': 'Local Skilled Workers',
  'local skilled workers': 'Local Skilled Workers',
  'skilledtrades': 'Skilled Trades',
  'skilled trades': 'Skilled Trades',
  'electronicsappliances': 'Electronics & Appliances',
  'electronics & appliances': 'Electronics & Appliances',
  'pestcontrol': 'Pest Control',
  'pest control': 'Pest Control',
  'beautywellness': 'Beauty & Wellness',
  'beauty & wellness': 'Beauty & Wellness',
  'fitnessservices': 'Fitness Services',
  'fitness services': 'Fitness Services',
  'securityservices': 'Security Services',
  'security services': 'Security Services',
  'healthcarewellness': 'Healthcare & Wellness',
  'healthcare & wellness': 'Healthcare & Wellness',
  'tutoringeducation': 'Tutoring & Education',
  'tutoring & education': 'Tutoring & Education',
};

/**
 * Normalize input for lookup (case-insensitive, whitespace-tolerant, punctuation-tolerant)
 */
function normalizeForLookup(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[_\-&\/]/g, '');
}

/**
 * Capitalize words fallback for unknown slugs
 * Converts "homeimprovement" → "Home Improvement"
 */
function capitalizeWords(input: string): string {
  // Split on common word boundaries
  let withSpaces = input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase
    .replace(/[_\-\/]/g, ' ') // underscores, hyphens, slashes
    .replace(/&/g, ' & '); // ampersands
  
  // For all-lowercase concatenated words, try to split intelligently
  if (withSpaces === withSpaces.toLowerCase() && !withSpaces.includes(' ')) {
    withSpaces = withSpaces
      .replace(/(service|services|work|worker|workers|cleaning|improvement|trades|control|wellness|fitness|security|helpers|skilled)$/i, ' $1')
      .replace(/^(home|vehicle|specialized|security|skilled|electronics|pest|beauty|fitness|household|event|general|local|daily)/i, '$1 ');
  }
  
  // Split on spaces and capitalize each word
  const words = withSpaces.split(/\s+/).filter(w => w.length > 0);
  
  return words
    .map(word => {
      // Handle special cases
      const lowerWord = word.toLowerCase();
      if (lowerWord === 'and') return '&';
      if (['ac', 'tv', 'id'].includes(lowerWord)) return word.toUpperCase();
      
      // Standard title case
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Get human-readable category label from slug
 * 
 * This is the single centralized helper for category display.
 * 
 * @param slug - Raw category slug from database/URL
 * @returns Human-readable label (never returns raw slug)
 * 
 * @example
 * getCategoryLabel('construction') // 'Construction'
 * getCategoryLabel('homeimprovement') // 'Home Improvement'
 * getCategoryLabel('specializedcleaning') // 'Specialized Cleaning'
 * getCategoryLabel('unknownslug') // 'Unknown Slug' (fallback)
 */
export function getCategoryLabel(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    return '';
  }
  
  const trimmed = slug.trim();
  if (trimmed.length === 0) {
    return '';
  }
  
  // Try exact match first (case-sensitive)
  if (CATEGORY_LABELS[trimmed]) {
    return CATEGORY_LABELS[trimmed];
  }
  
  // Try normalized lookup (case-insensitive, whitespace/punctuation tolerant)
  const normalized = normalizeForLookup(trimmed);
  
  // Check all keys in CATEGORY_LABELS with normalization
  for (const [key, value] of Object.entries(CATEGORY_LABELS)) {
    if (normalizeForLookup(key) === normalized) {
      return value;
    }
  }
  
  // Fallback: capitalize words (never show raw slug)
  return capitalizeWords(trimmed);
}
