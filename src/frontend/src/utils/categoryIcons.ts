/**
 * Centralized category icon mapping utility
 * NOTE: Main category icons (Construction, Agriculture, Home Services, Transport, 
 * Events & Cooking, Daily Helpers, Repairs, Supplies) are now rendered using
 * mainCategoryIcons.ts utility in HomePage.tsx.
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
  'tailoring': '/assets/generated/icon-tailoring.dim_128x128.png',
  
  // Local Skilled Workers
  'local skilled workers': '/assets/generated/icon-local-skilled-workers.dim_128x128.png',
  'localskilledworkers': '/assets/generated/icon-local-skilled-workers.dim_128x128.png',
  'localSkilledWorkers': '/assets/generated/icon-local-skilled-workers.dim_128x128.png',
};

// Fallback icon for missing/invalid categories
const FALLBACK_ICON = '/assets/generated/icon-fallback.dim_128x128.png';

/**
 * Get icon path for a category key
 * Handles case-insensitive matching and common variants
 * @param categoryKey - The category identifier (e.g., 'tailoring', 'localSkilledWorkers')
 * @returns Local PNG icon path or fallback icon
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

  // Try normalized match (remove spaces, &, /)
  const normalizedKey = normalizeCategoryKey(categoryKey);
  if (CATEGORY_ICON_MAP[normalizedKey]) {
    return CATEGORY_ICON_MAP[normalizedKey];
  }

  // Return fallback if no match found
  return FALLBACK_ICON;
}
