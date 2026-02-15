import { createContext, useContext, ReactNode } from 'react';
import { getTranslation, BilingualValue } from './translations';

export type SupportedState = 'TN' | 'KA' | 'KL' | 'AP' | 'TS' | 'NORTH' | 'DEFAULT';
export type RegionalLanguage = 'ta' | 'kn' | 'ml' | 'te' | 'hi' | 'en';

interface I18nContextType {
  selectedState: SupportedState;
  setSelectedState: (state: SupportedState) => void;
  regionalLanguage: RegionalLanguage;
  t: (key: string) => { en: string; regional: string };
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const stateToLanguageMap: Record<SupportedState, RegionalLanguage> = {
  TN: 'ta',
  KA: 'kn',
  KL: 'ml',
  AP: 'te',
  TS: 'te',
  NORTH: 'hi',
  DEFAULT: 'ta',
};

/**
 * Checks if a string looks like a raw i18n key (contains dots)
 */
function looksLikeRawKey(text: string): boolean {
  return text.includes('.') && text.split('.').length > 1;
}

/**
 * Humanizes a raw key by converting it to Title Case
 */
function humanizeKey(key: string): string {
  if (!key) return '';
  
  // Extract the last segment after the last dot
  const lastSegment = key.includes('.') ? key.split('.').pop() || key : key;
  
  // Convert camelCase/snake_case to Title Case
  return lastSegment
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always use Tamil as primary language
  const selectedState: SupportedState = 'TN';
  const regionalLanguage: RegionalLanguage = 'ta';

  const setSelectedState = (_state: SupportedState) => {
    // No-op: language selection is disabled
  };

  const t = (key: string): { en: string; regional: string } => {
    const translation: BilingualValue = getTranslation(key);
    
    // Additional safety check: if the translation still looks like a raw key,
    // humanize it instead of displaying the key
    let finalEn = translation.en;
    let finalRegional = translation.ta;
    
    if (looksLikeRawKey(finalEn)) {
      finalEn = humanizeKey(key);
    }
    
    if (looksLikeRawKey(finalRegional)) {
      finalRegional = humanizeKey(key);
    }
    
    // Map 'ta' property to 'regional' for compatibility
    return {
      en: finalEn,
      regional: finalRegional,
    };
  };

  return (
    <I18nContext.Provider value={{ selectedState, setSelectedState, regionalLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
