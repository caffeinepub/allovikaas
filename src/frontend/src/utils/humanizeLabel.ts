// Utility functions to convert raw database/system keys into human-readable labels
// Used as fallback when translations are missing

/**
 * Converts a camelCase, snake_case, or concatenated string into Title Case
 * Examples:
 * - "homeimprovement" -> "Home Improvement"
 * - "work_type" -> "Work Type"
 * - "dateTime" -> "Date Time"
 */
export function humanizeKey(input: string): string {
  if (!input) return '';
  
  // Remove common prefixes
  let cleaned = input;
  const prefixes = ['category.', 'subcategory.', 'field.', 'job.'];
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      cleaned = cleaned.substring(prefix.length);
    }
  }
  
  // Split on various delimiters and camelCase boundaries
  const words = cleaned
    // Insert space before capital letters (camelCase)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace underscores and hyphens with spaces
    .replace(/[_-]/g, ' ')
    // Split concatenated lowercase words (basic heuristic)
    .replace(/([a-z])([a-z]{2,})/gi, '$1 $2')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ');
  
  // Title case each word
  return words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Creates a safe bilingual fallback for unknown taxonomy/field values
 * Returns English humanized label and Tamil placeholder
 */
export function createBilingualFallback(input: string): { en: string; regional: string } {
  const humanized = humanizeKey(input);
  
  // For Tamil, we provide a generic readable fallback
  // rather than showing the raw key or brackets
  return {
    en: humanized,
    regional: humanized, // Show humanized English as fallback for Tamil too
  };
}

/**
 * Checks if a translation result is valid (not a raw key or bracketed placeholder)
 */
export function isValidTranslation(translation: { en: string; regional: string }, originalKey: string): boolean {
  if (!translation || !translation.en || !translation.regional) {
    return false;
  }
  
  // Check if it's returning the key itself
  if (translation.en.includes(originalKey) || translation.regional.includes(originalKey)) {
    return false;
  }
  
  // Check for bracketed placeholders
  if (translation.en.startsWith('[') || translation.regional.startsWith('[')) {
    return false;
  }
  
  // Check for raw i18n key patterns (contains dots)
  if (translation.en.includes('.') && translation.en.split('.').length > 1) {
    return false;
  }
  
  return true;
}
