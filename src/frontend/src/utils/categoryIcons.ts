/**
 * Centralized category icon mapping utility
 * NOTE: Main category icons (Construction, Agriculture, Home Services, Transport, 
 * Events & Cooking, Daily Helpers, Repairs, Supplies) are now rendered as inline 
 * SVG React components in HomePage.tsx and should NOT use this utility.
 * 
 * This utility is retained for subcategory icons and other non-main-category use cases.
 */

// Normalize category key for consistent matching
function normalizeCategoryKey(key: string): string {
  return key.toLowerCase().trim().replace(/\s+/g, '').replace(/&/g, '').replace(/\//g, '');
}

// Subcategory and other icon mapping (excluding main 8 categories)
const CATEGORY_ICON_MAP: Record<string, string> = {
  // Tailoring
  'tailoring': '/assets/generated/icon-tailoring.dim_128x128.svg',
  
  // Local Skilled Workers
  'local skilled workers': '/assets/generated/icon-local-skilled-workers.dim_128x128.svg',
  'localskilledworkers': '/assets/generated/icon-local-skilled-workers.dim_128x128.svg',
  'localSkilledWorkers': '/assets/generated/icon-local-skilled-workers.dim_128x128.svg',
};

// Fallback icon for missing/invalid categories
const FALLBACK_ICON = '/assets/generated/icon-fallback.dim_128x128.svg';

/**
 * Get icon path for a category key
 * Handles case-insensitive matching and common variants
 * @param categoryKey - The category identifier (e.g., 'tailoring', 'localSkilledWorkers')
 * @returns Local SVG icon path or fallback icon
 */
export function getCategoryIcon(categoryKey: string | undefined | null): string {
  if (!categoryKey) {
    return FALLBACK_ICON;
  }

  // Try exact match first (case-sensitive)
  if (CATEGORY_ICON_MAP[categoryKey]) {
    return CATEGORY_ICON_MAP[categoryKey];
  }

  // Try lowercase match
  const lowerKey = categoryKey.toLowerCase();
  if (CATEGORY_ICON_MAP[lowerKey]) {
    return CATEGORY_ICON_MAP[lowerKey];
  }

  // Try normalized match (remove spaces, special chars)
  const normalizedKey = normalizeCategoryKey(categoryKey);
  if (CATEGORY_ICON_MAP[normalizedKey]) {
    return CATEGORY_ICON_MAP[normalizedKey];
  }

  // Search through all keys for a normalized match
  for (const [key, iconPath] of Object.entries(CATEGORY_ICON_MAP)) {
    if (normalizeCategoryKey(key) === normalizedKey) {
      return iconPath;
    }
  }

  // Return fallback if no match found
  return FALLBACK_ICON;
}
