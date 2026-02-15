/**
 * Centralized displayName formatter for taxonomy strings
 * 
 * This is the single source of truth for converting raw taxonomy values
 * (slugs, camelCase, concatenated words) into human-readable Title Case.
 * 
 * IMPORTANT: This is display-only. Never use this to modify stored values,
 * URL params, or backend query inputs.
 * 
 * NOTE: For categories, use getCategoryLabel() from categoryLabels.ts instead.
 * This formatter is for subcategories, skills, and other non-category taxonomy values.
 * 
 * Rules:
 * 1. Split joined words (homeimprovement → home improvement)
 * 2. Insert spaces before capital letters (vehicleServices → vehicle Services)
 * 3. Convert to Title Case (specialized cleaning → Specialized Cleaning)
 * 4. Never show raw slug in UI
 */

// Explicit override mappings for known taxonomy values (non-categories)
const DISPLAY_NAME_MAP: Record<string, string> = {
  // Common subcategories
  'blousestitching': 'Blouse Stitching',
  'sareework': 'Saree Work',
  'sareefallspico': 'Saree Falls/Pico',
  'aariworker': 'Aari Worker',
  'ironingservice': 'Ironing Service',
  'housemaid': 'House Maid',
  'onedaycookingworker': 'One Day Cooking Worker',
  'functioncookingteam': 'Function Cooking Team',
  'cleaningworker': 'Cleaning Worker',
  'farmlabour': 'Farm Labour',
  'plantingworker': 'Planting Worker',
  'harvestworker': 'Harvest Worker',
  'sprayerworker': 'Sprayer Worker',
  'cooliehelper': 'Coolie/Helper',
  'centringworker': 'Centring Worker',
  'barbendingworker': 'Bar Bending Worker',
  'doormaker': 'Door Maker',
  'windowmaker': 'Window Maker',
  'grillgatefabricator': 'Grill/Gate Fabricator',
  'treecutter': 'Tree Cutter',
  'coconuttreeclimber': 'Coconut Tree Climber',
  'coconutpicker': 'Coconut Picker',
  'firewoodcutter': 'Firewood Cutter',
  'basketmaker': 'Basket Maker',
  'ropemaker': 'Rope Maker',
  'matweaver': 'Mat Weaver',
  'potmaker': 'Pot Maker',
  'blousedesigner': 'Blouse Designer',
  'sareefallspicoworker': 'Saree Falls/Pico Worker',
  'plumber': 'Plumber',
  'electrician': 'Electrician',
  'painter': 'Painter',
  'carpenter': 'Carpenter',
  'mason': 'Mason',
  'welder': 'Welder',
  'tailor': 'Tailor',
  'maid': 'Maid',
  'housekeeper': 'Housekeeper',
  'barber': 'Barber',
  'beautician': 'Beautician',
  'driver': 'Driver',
  'security': 'Security',
  'helper': 'Helper',
  'admin': 'Admin',
  'labour': 'Labour',
  'laborer': 'Laborer',
};

/**
 * Normalize a string for lookup (lowercase, no spaces/special chars)
 */
function normalizeForLookup(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[_\-&\/]/g, '');
}

/**
 * Split concatenated or camelCase words into separate words
 * Handles patterns like:
 * - homeimprovement → home improvement
 * - vehicleServices → vehicle Services
 * - specialized_cleaning → specialized cleaning
 */
function splitIntoWords(input: string): string[] {
  // First, handle camelCase by inserting spaces before capitals
  let withSpaces = input.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Replace underscores, hyphens, and slashes with spaces
  withSpaces = withSpaces.replace(/[_\-\/]/g, ' ');
  
  // For all-lowercase concatenated words, try to split intelligently
  if (withSpaces === withSpaces.toLowerCase() && !withSpaces.includes(' ')) {
    // Try common word boundary patterns
    withSpaces = withSpaces
      // Split before common suffixes
      .replace(/(service|services|work|worker|workers|cleaning|improvement|trades|control|wellness|fitness|security|helpers|skilled)$/i, ' $1')
      // Split common prefixes
      .replace(/^(home|vehicle|specialized|security|skilled|electronics|pest|beauty|fitness|household|event|general|local|daily)/i, '$1 ')
      // Split before 'and' patterns
      .replace(/([a-z])(and)([a-z])/gi, '$1 $2 $3');
  }
  
  // Split on spaces and filter empty strings
  const words = withSpaces.split(/\s+/).filter(w => w.length > 0);
  
  return words;
}

/**
 * Convert a word to Title Case
 */
function toTitleCase(word: string): string {
  if (!word) return '';
  
  // Handle special cases for common abbreviations/acronyms
  const upperWords = ['ac', 'tv', 'id', 'and'];
  const lowerWord = word.toLowerCase();
  
  if (upperWords.includes(lowerWord)) {
    return lowerWord === 'and' ? '&' : word.toUpperCase();
  }
  
  // Standard title case
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/**
 * Format a taxonomy value into human-readable Title Case display name
 * 
 * This is the centralized formatter that ensures no raw slugs/camelCase
 * are ever displayed in the UI.
 * 
 * NOTE: For categories, use getCategoryLabel() from categoryLabels.ts instead.
 * 
 * @param value - Raw taxonomy value (slug/camelCase/underscore/hyphen)
 * @returns Human-readable Title Case string
 * 
 * @example
 * displayName('blousestitching') // 'Blouse Stitching'
 * displayName('sareework') // 'Saree Work'
 * displayName('cooliehelper') // 'Coolie/Helper'
 */
export function displayName(value: string): string {
  if (!value || typeof value !== 'string') {
    return '';
  }
  
  // Trim and check for empty
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return '';
  }
  
  // Check explicit override map first (normalized lookup)
  const normalized = normalizeForLookup(trimmed);
  if (DISPLAY_NAME_MAP[normalized]) {
    return DISPLAY_NAME_MAP[normalized];
  }
  
  // If no explicit mapping, split and title-case the words
  const words = splitIntoWords(trimmed);
  
  // Convert each word to title case
  const formatted = words.map(toTitleCase).join(' ');
  
  // If we still have a single long word, it might be a concatenated term
  // Apply one more heuristic split
  if (formatted.split(' ').length === 1 && formatted.length > 12) {
    // Try to split by common patterns one more time
    const lastAttempt = formatted
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([a-z])(Service|Work|Cleaning|Helper|Worker)/g, '$1 $2');
    
    if (lastAttempt.includes(' ')) {
      return lastAttempt.split(' ').map(toTitleCase).join(' ');
    }
  }
  
  return formatted;
}
