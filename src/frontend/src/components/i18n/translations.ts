// Local translation dictionary loader
// Loads translations from JSON files at build time

import enTranslations from './locales/en.json';
import taTranslations from './locales/ta.json';

export type TranslationKey = string;

export interface BilingualValue {
  en: string;
  ta: string;
}

/**
 * Flattens nested JSON object into dot-notation keys
 * Example: { app: { name: "Test" } } => { "app.name": "Test" }
 */
function flattenObject(obj: any, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value, newKey));
      } else {
        result[newKey] = String(value);
      }
    }
  }
  
  return result;
}

// Flatten the imported JSON translations
const flatEnTranslations = flattenObject(enTranslations);
const flatTaTranslations = flattenObject(taTranslations);

// Build the main translation dictionary
export const translations: Record<TranslationKey, BilingualValue> = {};

// Merge English and Tamil translations
for (const key in flatEnTranslations) {
  translations[key] = {
    en: flatEnTranslations[key],
    ta: flatTaTranslations[key] || flatEnTranslations[key], // Fallback to English if Tamil missing
  };
}

/**
 * Humanizes a raw key by converting it to Title Case
 * Used as fallback when translation is missing
 */
function humanizeKey(key: string): string {
  if (!key) return '';
  
  // Extract the last segment after the last dot
  const lastSegment = key.includes('.') ? key.split('.').pop() || key : key;
  
  // Convert camelCase/snake_case/concatenated to Title Case with proper spacing
  return lastSegment
    // Insert space before capital letters in camelCase
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Replace underscores and hyphens with spaces
    .replace(/[_-]/g, ' ')
    // Insert space between lowercase and uppercase in concatenated words
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    // Split and capitalize each word
    .split(/\s+/)
    .map(word => {
      if (!word) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ')
    .trim();
}

/**
 * Helper function to get translation by key with safe fallback
 * Never returns raw dotted keys - always returns human-readable text
 */
export function getTranslation(key: TranslationKey): BilingualValue {
  const translation = translations[key];
  
  if (translation) {
    return translation;
  }
  
  // Fallback: humanize the key instead of returning it raw
  const humanized = humanizeKey(key);
  
  return {
    en: humanized,
    ta: humanized, // Use humanized English as Tamil fallback
  };
}
