import { useI18n } from '@/components/i18n/I18nProvider';
import { displayName } from './displayName';
import { getCategoryLabel } from './categoryLabels';
import { isValidTranslation } from './humanizeLabel';

// Explicit mapping for known category variants to i18n keys
const CATEGORY_KEY_MAP: Record<string, string> = {
  // Construction
  'construction': 'construction',
  
  // Agriculture
  'agriculture': 'agriculture',
  
  // Home Services
  'homeservices': 'homeServices',
  'home services': 'homeServices',
  'household services': 'homeServices',
  'householdservices': 'homeServices',
  
  // Transport
  'transport': 'transport',
  'vehicle services': 'transport',
  'vehicleservices': 'transport',
  
  // Events & Cooking
  'events': 'eventWork',
  'events & cooking': 'eventWork',
  'events&cooking': 'eventWork',
  'eventscooking': 'eventWork',
  'events cooking': 'eventWork',
  'event work': 'eventWork',
  'eventwork': 'eventWork',
  'event services': 'eventWork',
  'eventservices': 'eventWork',
  
  // Daily Helpers
  'helpers': 'dailyHelpers',
  'daily helpers': 'dailyHelpers',
  'dailyhelpers': 'dailyHelpers',
  'home help': 'dailyHelpers',
  'homehelp': 'dailyHelpers',
  
  // Repairs
  'repairs': 'repairs',
  
  // Supplies
  'supplies': 'supplies',
  
  // Tailoring
  'tailoring': 'tailoring',
  
  // Local Skilled Workers
  'local skilled workers': 'localSkilledWorkers',
  'localskilledworkers': 'localSkilledWorkers',
  
  // The 7 new categories from user request
  'homeimprovement': 'homeimprovement',
  'home improvement': 'homeimprovement',
  'specializedcleaning': 'specializedcleaning',
  'specialized cleaning': 'specializedcleaning',
  'skilledtrades': 'skilledtrades',
  'skilled trades': 'skilledtrades',
  'electronicsappliances': 'electronicsappliances',
  'electronics appliances': 'electronicsappliances',
  'electronics & appliances': 'electronicsappliances',
  'pestcontrol': 'pestcontrol',
  'pest control': 'pestcontrol',
  'beautywellness': 'beautywellness',
  'beauty wellness': 'beautywellness',
  'beauty & wellness': 'beautywellness',
  'fitnessservices': 'fitnessservices',
  'fitness services': 'fitnessservices',
  'securityservices': 'securityservices',
  'security services': 'securityservices',
};

// Explicit mapping for known group variants to i18n keys
const GROUP_KEY_MAP: Record<string, string> = {
  'construction': 'construction',
  'wood & metal': 'woodmetal',
  'wood&metal': 'woodmetal',
  'woodmetal': 'woodmetal',
  'tree work': 'treework',
  'treework': 'treework',
  'home help': 'homehelp',
  'homehelp': 'homehelp',
  'tailoring': 'tailoring',
  'agriculture': 'agriculture',
};

function normalizeKey(input: string): string {
  return input.toLowerCase().trim().replace(/\s+/g, '').replace(/&/g, '').replace(/\//g, '');
}

export function getBilingualCategoryLabel(category: string, t: ReturnType<typeof useI18n>['t']): { en: string; regional: string } {
  try {
    if (!category) {
      return { en: 'Category', regional: 'வகை' };
    }

    // Strip "category." prefix if already present
    let cleanCategory = category;
    if (category.startsWith('category.')) {
      cleanCategory = category.substring(9);
    }

    const normalizedCategory = cleanCategory.toLowerCase().trim();
    
    // Try exact match first
    let categoryKey = CATEGORY_KEY_MAP[normalizedCategory];
    
    // If no exact match, try normalized match
    if (!categoryKey) {
      const normalized = normalizeKey(cleanCategory);
      categoryKey = CATEGORY_KEY_MAP[normalized];
    }
    
    // If still no match, use the normalized version as key
    if (!categoryKey) {
      categoryKey = normalizeKey(cleanCategory);
    }
    
    const translation = t(`category.${categoryKey}`);
    
    // Check if translation is valid using the helper
    if (isValidTranslation(translation, `category.${categoryKey}`)) {
      return translation;
    }
    
    // Safe fallback: use the centralized category label helper
    const formatted = getCategoryLabel(cleanCategory);
    return {
      en: formatted,
      regional: formatted,
    };
  } catch (error) {
    console.error('Error getting bilingual category label:', error);
    const formatted = getCategoryLabel(category || 'Category');
    return {
      en: formatted,
      regional: formatted,
    };
  }
}

export function getBilingualSubcategoryLabel(subcategory: string, t: ReturnType<typeof useI18n>['t']): { en: string; regional: string } {
  try {
    if (!subcategory) {
      return { en: 'Subcategory', regional: 'துணை வகை' };
    }

    // Strip "subcategory." prefix if already present
    let cleanSubcategory = subcategory;
    if (subcategory.startsWith('subcategory.')) {
      cleanSubcategory = subcategory.substring(12);
    }

    // Normalize: lowercase, remove spaces, slashes, hyphens
    const subcategoryKey = normalizeKey(cleanSubcategory);
    const translation = t(`subcategory.${subcategoryKey}`);
    
    // Check if translation is valid using the helper
    if (isValidTranslation(translation, `subcategory.${subcategoryKey}`)) {
      return translation;
    }
    
    // Safe fallback: use the centralized displayName formatter (for subcategories, not categories)
    const formatted = displayName(cleanSubcategory);
    return {
      en: formatted,
      regional: formatted,
    };
  } catch (error) {
    console.error('Error getting bilingual subcategory label:', error);
    const formatted = displayName(subcategory || 'Subcategory');
    return {
      en: formatted,
      regional: formatted,
    };
  }
}

export function getBilingualGroupLabel(group: string, t: ReturnType<typeof useI18n>['t']): { en: string; regional: string } {
  try {
    if (!group) {
      return { en: 'Group', regional: 'குழு' };
    }

    // Strip "subgroup." prefix if already present
    let cleanGroup = group;
    if (group.startsWith('subgroup.')) {
      cleanGroup = group.substring(9);
    }

    const normalizedGroup = cleanGroup.toLowerCase().trim();
    
    // Try exact match first
    let groupKey = GROUP_KEY_MAP[normalizedGroup];
    
    // If no exact match, try normalized match
    if (!groupKey) {
      const normalized = normalizeKey(cleanGroup);
      groupKey = GROUP_KEY_MAP[normalized];
    }
    
    // If still no match, use the normalized version as key
    if (!groupKey) {
      groupKey = normalizeKey(cleanGroup);
    }
    
    const translation = t(`subgroup.${groupKey}`);
    
    // Check if translation is valid using the helper
    if (isValidTranslation(translation, `subgroup.${groupKey}`)) {
      return translation;
    }
    
    // Safe fallback: use the centralized displayName formatter
    const formatted = displayName(cleanGroup);
    return {
      en: formatted,
      regional: formatted,
    };
  } catch (error) {
    console.error('Error getting bilingual group label:', error);
    const formatted = displayName(group || 'Group');
    return {
      en: formatted,
      regional: formatted,
    };
  }
}
