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
  // Main categories
  'construction': 'Construction',
  'agriculture': 'Agriculture',
  'homeservices': 'Home Services',
  'home services': 'Home Services',
  'transport': 'Transport',
  'homeimprovement': 'Home Improvement',
  'home improvement': 'Home Improvement',
  'specializedcleaning': 'Specialized Cleaning',
  'specialized cleaning': 'Specialized Cleaning',
  'generalservices': 'General Services',
  'general services': 'General Services',
  'woodmetal': 'Wood & Metal Works',
  'wood & metal': 'Wood & Metal Works',
  'wood metal': 'Wood & Metal Works',
  'treework': 'Tree Cutting & Coconut Climbing',
  'tree work': 'Tree Cutting & Coconut Climbing',
  'householdservices': 'Household Services',
  'household services': 'Household Services',
  'vehicleservices': 'Vehicle Services',
  'vehicle services': 'Vehicle Services',
  'tailoring': 'Tailoring',
  'aariwork': 'Aari Work',
  'aari work': 'Aari Work',
  'catering': 'Cooking / Catering',
  'eventservices': 'Event Services',
  'event services': 'Event Services',
  'events': 'Events & Cooking',
  'events & cooking': 'Events & Cooking',
  'events&cooking': 'Events & Cooking',
  'eventscooking': 'Events & Cooking',
  'events cooking': 'Events & Cooking',
  'event work': 'Events & Cooking',
  'eventwork': 'Events & Cooking',
  'printing': 'Printing & Flex',
  'repair': 'Repair Services',
  'repairs': 'Repair Services',
  'electrical': 'Electrical',
  'plumbing': 'Plumbing',
  'painting': 'Painting',
  'carpenter': 'Carpentry',
  'carpentry': 'Carpentry',
  'welding': 'Welding',
  'dailyhelpers': 'Daily Helpers',
  'daily helpers': 'Daily Helpers',
  'helpers': 'Daily Helpers',
  'supplies': 'Supplies',
  'localskilledworkers': 'Local Skilled Workers',
  'local skilled workers': 'Local Skilled Workers',
  'skilledtrades': 'Skilled Trades',
  'skilled trades': 'Skilled Trades',
  'electronicsappliances': 'Electronics & Appliances',
  'electronics appliances': 'Electronics & Appliances',
  'electronics & appliances': 'Electronics & Appliances',
  'pestcontrol': 'Pest Control',
  'pest control': 'Pest Control',
  'beautywellness': 'Beauty & Wellness',
  'beauty wellness': 'Beauty & Wellness',
  'beauty & wellness': 'Beauty & Wellness',
  'fitnessservices': 'Fitness Services',
  'fitness services': 'Fitness Services',
  'securityservices': 'Security Services',
  'security services': 'Security Services',
  'healthcarewellness': 'Healthcare & Wellness',
  'healthcare wellness': 'Healthcare & Wellness',
  'healthcare & wellness': 'Healthcare & Wellness',
  'homehelp': 'Home Help',
  'home help': 'Home Help',
};

/**
 * Normalizes a category string for lookup
 * Converts to lowercase, trims, collapses whitespace
 */
function normalizeCategory(category: string): string {
  return category
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

/**
 * Converts a raw category slug/name into a human-readable display label
 * Uses strict mapping with intelligent fallback
 * 
 * @param category - Raw category string from database
 * @returns Human-readable category label (never returns raw slug)
 */
export function getCategoryLabel(category: string): string {
  if (!category) return 'Category';
  
  const normalized = normalizeCategory(category);
  
  // Try exact match first
  if (CATEGORY_LABELS[normalized]) {
    return CATEGORY_LABELS[normalized];
  }
  
  // Try without spaces (for concatenated versions like "homeimprovement")
  const noSpaces = normalized.replace(/\s+/g, '');
  if (CATEGORY_LABELS[noSpaces]) {
    return CATEGORY_LABELS[noSpaces];
  }
  
  // Fallback: Convert to Title Case with proper word spacing
  // Handle concatenated words like "homeimprovement" -> "Home Improvement"
  return category
    // Insert space before capital letters in camelCase
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace underscores and hyphens with spaces
    .replace(/[_-]/g, ' ')
    // Split into words and capitalize each
    .split(/\s+/)
    .map(word => {
      if (!word) return '';
      // Handle all-caps words
      if (word === word.toUpperCase() && word.length > 1) {
        return word.charAt(0) + word.slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();
}
