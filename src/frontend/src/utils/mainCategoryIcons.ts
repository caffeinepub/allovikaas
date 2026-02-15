/**
 * Main category icon mapping for homepage category grid
 * Maps category strings to their corresponding PNG icon assets
 */

function normalizeCategoryKey(key: string): string {
  return key.toLowerCase().trim().replace(/\s+/g, '').replace(/&/g, '').replace(/\//g, '');
}

const MAIN_CATEGORY_ICON_MAP: Record<string, string> = {
  // Construction
  'construction': '/assets/generated/category-construction-building.dim_128x128.png',
  
  // Agriculture
  'agriculture': '/assets/generated/category-agriculture-plant.dim_128x128.png',
  
  // Home Services (multiple variants)
  'homeservices': '/assets/generated/category-home-services-house.dim_128x128.png',
  'home services': '/assets/generated/category-home-services-house.dim_128x128.png',
  'household services': '/assets/generated/category-home-services-house.dim_128x128.png',
  'householdservices': '/assets/generated/category-home-services-house.dim_128x128.png',
  
  // Transport
  'transport': '/assets/generated/category-transport-truck.dim_128x128.png',
  'vehicle services': '/assets/generated/category-transport-truck.dim_128x128.png',
  'vehicleservices': '/assets/generated/category-transport-truck.dim_128x128.png',
  
  // Events & Cooking (multiple variants)
  'events': '/assets/generated/category-events-cooking-pot.dim_128x128.png',
  'events & cooking': '/assets/generated/category-events-cooking-pot.dim_128x128.png',
  'events&cooking': '/assets/generated/category-events-cooking-pot.dim_128x128.png',
  'eventscooking': '/assets/generated/category-events-cooking-pot.dim_128x128.png',
  'events cooking': '/assets/generated/category-events-cooking-pot.dim_128x128.png',
  'event work': '/assets/generated/category-events-cooking-pot.dim_128x128.png',
  'eventwork': '/assets/generated/category-events-cooking-pot.dim_128x128.png',
  'event services': '/assets/generated/category-events-cooking-pot.dim_128x128.png',
  'eventservices': '/assets/generated/category-events-cooking-pot.dim_128x128.png',
  
  // Daily Helpers (multiple variants)
  'helpers': '/assets/generated/category-daily-helpers-person.dim_128x128.png',
  'daily helpers': '/assets/generated/category-daily-helpers-person.dim_128x128.png',
  'dailyhelpers': '/assets/generated/category-daily-helpers-person.dim_128x128.png',
  'home help': '/assets/generated/category-daily-helpers-person.dim_128x128.png',
  'homehelp': '/assets/generated/category-daily-helpers-person.dim_128x128.png',
  
  // Repairs
  'repairs': '/assets/generated/category-repairs-tools.dim_128x128.png',
  
  // Supplies
  'supplies': '/assets/generated/category-supplies-box.dim_128x128.png',
  
  // Tailoring
  'tailoring': '/assets/generated/icon-tailoring.dim_128x128.png',
  
  // Local Skilled Workers
  'local skilled workers': '/assets/generated/icon-local-skilled-workers.dim_128x128.png',
  'localskilledworkers': '/assets/generated/icon-local-skilled-workers.dim_128x128.png',
};

const FALLBACK_ICON = '/assets/generated/icon-fallback.dim_128x128.png';

/**
 * Get the icon path for a main category
 * Handles case-insensitive matching and common category name variants
 * @param category - The category name (e.g., 'Construction', 'Home Services')
 * @returns PNG icon path or fallback icon
 */
export function getMainCategoryIcon(category: string | undefined | null): string {
  if (!category) {
    return FALLBACK_ICON;
  }

  // Try exact match first (case-sensitive)
  if (MAIN_CATEGORY_ICON_MAP[category]) {
    return MAIN_CATEGORY_ICON_MAP[category];
  }

  // Try lowercase match
  const lowerCategory = category.toLowerCase();
  if (MAIN_CATEGORY_ICON_MAP[lowerCategory]) {
    return MAIN_CATEGORY_ICON_MAP[lowerCategory];
  }

  // Try normalized match (remove spaces, &, /)
  const normalizedCategory = normalizeCategoryKey(category);
  if (MAIN_CATEGORY_ICON_MAP[normalizedCategory]) {
    return MAIN_CATEGORY_ICON_MAP[normalizedCategory];
  }

  // Return fallback if no match found
  return FALLBACK_ICON;
}
