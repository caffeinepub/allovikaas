// Utility to convert DB/system field keys into bilingual display labels
// Used for form fields and dynamic labels

import { getTranslation, BilingualValue } from '@/components/i18n/translations';
import { humanizeKey } from './humanizeLabel';

/**
 * Converts a field key (snake_case, camelCase, or dotted) into a bilingual label
 * Uses i18n when available, falls back to humanized label
 */
export function getBilingualFieldLabel(fieldKey: string): { en: string; regional: string } {
  if (!fieldKey) {
    return { en: 'Field', regional: 'புலம்' };
  }

  // Try to get translation from i18n
  // Check multiple possible key formats
  const possibleKeys = [
    `job.field.${fieldKey}`,
    `register.field.${fieldKey}`,
    `field.${fieldKey}`,
    fieldKey,
  ];

  for (const key of possibleKeys) {
    const translation: BilingualValue = getTranslation(key);
    
    // Check if we got a valid translation (not just the humanized fallback)
    if (translation && !translation.en.includes('.') && translation.en !== humanizeKey(key)) {
      // Map 'ta' to 'regional'
      return {
        en: translation.en,
        regional: translation.ta,
      };
    }
  }

  // Fallback: humanize the field key
  const humanized = humanizeKey(fieldKey);
  return {
    en: humanized,
    regional: humanized, // Show humanized English as fallback for Tamil
  };
}
