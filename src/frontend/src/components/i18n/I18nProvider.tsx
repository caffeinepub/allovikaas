import { createContext, useContext, ReactNode } from 'react';
import { getTranslation } from './translations';

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

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always use Tamil as primary language
  const selectedState: SupportedState = 'TN';
  const regionalLanguage: RegionalLanguage = 'ta';

  const setSelectedState = (_state: SupportedState) => {
    // No-op: language selection is disabled
  };

  const t = (key: string): { en: string; regional: string } => {
    // getTranslation now returns { en, regional } directly
    return getTranslation(key);
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
