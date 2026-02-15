import { useI18n } from '@/components/i18n/I18nProvider';

// Explicit mapping for known category variants to i18n keys
const CATEGORY_KEY_MAP: Record<string, string> = {
  'construction': 'construction',
  'agriculture': 'agriculture',
  'homeservices': 'homeservices',
  'home services': 'homeservices',
  'transport': 'transport',
  'events': 'events',
  'events & cooking': 'events',
  'events&cooking': 'events',
  'eventscooking': 'events',
  'helpers': 'helpers',
  'daily helpers': 'helpers',
  'dailyhelpers': 'helpers',
  'repairs': 'repairs',
  'supplies': 'supplies',
  'local skilled workers': 'localSkilledWorkers',
  'localskilledworkers': 'localSkilledWorkers',
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

export function getBilingualCategoryLabel(category: string, t: ReturnType<typeof useI18n>['t']): { en: string; regional: string } {
  try {
    if (!category) {
      return { en: 'Category', regional: 'வகை' };
    }

    const normalizedCategory = category.toLowerCase().trim();
    const categoryKey = CATEGORY_KEY_MAP[normalizedCategory] || normalizedCategory.replace(/\s+/g, '').replace(/&/g, '');
    
    const translation = t(`category.${categoryKey}`);
    
    if (translation && translation.en && translation.regional && translation.regional !== categoryKey) {
      return translation;
    }
    
    // Safe fallback with non-empty regional value
    return { en: category, regional: category };
  } catch (error) {
    console.error('Error getting bilingual category label:', error);
    return { en: category || 'Category', regional: category || 'வகை' };
  }
}

export function getBilingualSubcategoryLabel(subcategory: string, t: ReturnType<typeof useI18n>['t']): { en: string; regional: string } {
  try {
    if (!subcategory) {
      return { en: 'Subcategory', regional: 'துணை வகை' };
    }

    const subcategoryKey = subcategory.toLowerCase().replace(/\s+/g, '').replace(/\//g, '').replace(/-/g, '');
    const translation = t(`subcategory.${subcategoryKey}`);
    
    if (translation && translation.en && translation.regional && translation.regional !== subcategoryKey) {
      return translation;
    }
    
    // Safe fallback with non-empty regional value
    return { en: subcategory, regional: subcategory };
  } catch (error) {
    console.error('Error getting bilingual subcategory label:', error);
    return { en: subcategory || 'Subcategory', regional: subcategory || 'துணை வகை' };
  }
}

export function getBilingualGroupLabel(groupName: string, t: ReturnType<typeof useI18n>['t']): { en: string; regional: string } {
  try {
    if (!groupName) {
      return { en: 'Group', regional: 'குழு' };
    }

    const normalizedGroup = groupName.toLowerCase().trim();
    const groupKey = GROUP_KEY_MAP[normalizedGroup] || normalizedGroup.replace(/\s+/g, '').replace(/&/g, '');
    
    const translation = t(`group.${groupKey}`);
    
    if (translation && translation.en && translation.regional && translation.regional !== groupKey) {
      return translation;
    }
    
    // Safe fallback with non-empty regional value
    return { en: groupName, regional: groupName };
  } catch (error) {
    console.error('Error getting bilingual group label:', error);
    return { en: groupName || 'Group', regional: groupName || 'குழு' };
  }
}
