import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  DEFAULT: 'en',
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [selectedState, setSelectedStateInternal] = useState<SupportedState>(() => {
    const stored = localStorage.getItem('areaworker-state');
    return (stored as SupportedState) || 'DEFAULT';
  });

  const regionalLanguage = stateToLanguageMap[selectedState];

  const setSelectedState = (state: SupportedState) => {
    setSelectedStateInternal(state);
    localStorage.setItem('areaworker-state', state);
  };

  const t = (key: string) => {
    const translations = getTranslations(key, regionalLanguage);
    return translations;
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

function getTranslations(key: string, lang: RegionalLanguage): { en: string; regional: string } {
  const translations: Record<string, Record<RegionalLanguage, string>> = {
    'app.name': {
      en: 'AREA WORKER',
      ta: 'ஏரியா வொர்க்கர்',
      kn: 'ಏರಿಯಾ ವರ್ಕರ್',
      ml: 'ഏരിയ വർക്കർ',
      te: 'ఏరియా వర్కర్',
      hi: 'एरिया वर्कर',
    },
    'app.tagline': {
      en: 'Find People Who Work Near You',
      ta: 'உங்கள் அருகில் வேலை செய்யும் நபர்களை கண்டுபிடிக்கவும்',
      kn: 'ನಿಮ್ಮ ಹತ್ತಿರ ಕೆಲಸ ಮಾಡುವ ಜನರನ್ನು ಹುಡುಕಿ',
      ml: 'നിങ്ങളുടെ അടുത്ത് ജോലി ചെയ്യുന്ന ആളുകളെ കണ്ടെത്തുക',
      te: 'మీ దగ్గర పని చేసే వ్యక్తులను కనుగొనండి',
      hi: 'अपने पास काम करने वाले लोगों को खोजें',
    },
    'hero.search': {
      en: 'Search workers in your area',
      ta: 'உங்கள் பகுதியில் தொழிலாளர்களைத் தேடுங்கள்',
      kn: 'ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ಕೆಲಸಗಾರರನ್ನು ಹುಡುಕಿ',
      ml: 'നിങ്ങളുടെ പ്രദേശത്ത് തൊഴിലാളികളെ തിരയുക',
      te: 'మీ ప్రాంతంలో కార్మికులను వెతకండి',
      hi: 'अपने क्षेत्र में कार्यकर्ताओं को खोजें',
    },
    'category.construction': {
      en: 'Construction',
      ta: 'கட்டுமானம்',
      kn: 'ನಿರ್ಮಾಣ',
      ml: 'നിർമ്മാണം',
      te: 'నిర్మాణం',
      hi: 'निर्माण',
    },
    'category.agriculture': {
      en: 'Agriculture',
      ta: 'விவசாயம்',
      kn: 'ಕೃಷಿ',
      ml: 'കൃഷി',
      te: 'వ్యవసాయం',
      hi: 'कृषि',
    },
    'category.homeservices': {
      en: 'Home Services',
      ta: 'வீட்டு சேவைகள்',
      kn: 'ಮನೆ ಸೇವೆಗಳು',
      ml: 'ഗൃഹ സേവനങ്ങൾ',
      te: 'గృహ సేవలు',
      hi: 'घरेलू सेवाएं',
    },
    'category.transport': {
      en: 'Transport',
      ta: 'போக்குவரத்து',
      kn: 'ಸಾರಿಗೆ',
      ml: 'ഗതാഗതം',
      te: 'రవాణా',
      hi: 'परिवहन',
    },
    'category.events': {
      en: 'Events & Cooking',
      ta: 'நிகழ்வுகள் & சமையல்',
      kn: 'ಕಾರ್ಯಕ್ರಮಗಳು ಮತ್ತು ಅಡುಗೆ',
      ml: 'പരിപാടികളും പാചകവും',
      te: 'కార్యక్రమాలు & వంట',
      hi: 'कार्यक्रम और खाना पकाना',
    },
    'category.helpers': {
      en: 'Daily Helpers',
      ta: 'தினசரி உதவியாளர்கள்',
      kn: 'ದೈನಂದಿನ ಸಹಾಯಕರು',
      ml: 'ദൈനംദിന സഹായികൾ',
      te: 'రోజువారీ సహాయకులు',
      hi: 'दैनिक सहायक',
    },
    'category.repairs': {
      en: 'Repairs',
      ta: 'பழுதுபார்ப்பு',
      kn: 'ದುರಸ್ತಿ',
      ml: 'അറ്റകുറ്റപ്പണികൾ',
      te: 'మరమ్మతులు',
      hi: 'मरम्मत',
    },
    'category.supplies': {
      en: 'Supplies',
      ta: 'விநியோகங்கள்',
      kn: 'ಸರಬರಾಜುಗಳು',
      ml: 'വിതരണങ്ങൾ',
      te: 'సరఫరాలు',
      hi: 'आपूर्ति',
    },
    'category.localSkilledWorkers': {
      en: 'Local Skilled Workers',
      ta: 'உள்ளூர் கைதேர்ந்த தொழிலாளர்கள்',
      kn: 'ಸ್ಥಳೀಯ ನುರಿತ ಕಾರ್ಮಿಕರು',
      ml: 'പ്രാദേശിക വിദഗ്ധ തൊഴിലാളികൾ',
      te: 'స్థానిక నైపుణ్యం కలిగిన కార్మికులు',
      hi: 'स्थानीय कुशल कार्यकर्ता',
    },
    'worker.call': {
      en: 'Call',
      ta: 'அழைக்கவும்',
      kn: 'ಕರೆ ಮಾಡಿ',
      ml: 'വിളിക്കുക',
      te: 'కాల్ చేయండి',
      hi: 'कॉल करें',
    },
    'worker.whatsapp': {
      en: 'WhatsApp',
      ta: 'வாட்ஸ்அப்',
      kn: 'ವಾಟ್ಸಾಪ್',
      ml: 'വാട്ട്സാപ്പ്',
      te: 'వాట్సాప్',
      hi: 'व्हाट्सएप',
    },
    'worker.verified': {
      en: 'Verified',
      ta: 'சரிபார்க்கப்பட்டது',
      kn: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
      ml: 'പരിശോധിച്ചു',
      te: 'ధృవీకరించబడింది',
      hi: 'सत्यापित',
    },
    'worker.experience': {
      en: 'Experience',
      ta: 'அனுபவம்',
      kn: 'ಅನುಭವ',
      ml: 'പരിചയം',
      te: 'అనుభవం',
      hi: 'अनुभव',
    },
    'worker.availability': {
      en: 'Availability',
      ta: 'கிடைக்கும் நேரம்',
      kn: 'ಲಭ್ಯತೆ',
      ml: 'ലഭ്യത',
      te: 'లభ్యత',
      hi: 'उपलब्धता',
    },
    'job.title': {
      en: 'I Need a Worker',
      ta: 'எனக்கு வேலைக்காரர் தேவை',
      kn: 'ನನಗೆ ಕೆಲಸಗಾರ ಬೇಕು',
      ml: 'എനിക്ക് ഒരു തൊഴിലാളി വേണം',
      te: 'నాకు కార్మికుడు కావాలి',
      hi: 'मुझे एक कार्यकर्ता चाहिए',
    },
    'job.board': {
      en: 'Workers Needed Today',
      ta: 'இன்று தொழிலாளர்கள் தேவை',
      kn: 'ಇಂದು ಕೆಲಸಗಾರರು ಬೇಕು',
      ml: 'ഇന്ന് തൊഴിലാളികൾ ആവശ്യമാണ്',
      te: 'ఈరోజు కార్మికులు అవసరం',
      hi: 'आज कार्यकर्ता चाहिए',
    },
    'register.title': {
      en: 'Register as Worker',
      ta: 'தொழிலாளராக பதிவு செய்யுங்கள்',
      kn: 'ಕೆಲಸಗಾರನಾಗಿ ನೋಂದಾಯಿಸಿ',
      ml: 'തൊഴിലാളിയായി രജിസ്റ്റർ ചെയ്യുക',
      te: 'కార్మికునిగా నమోదు చేసుకోండి',
      hi: 'कार्यकर्ता के रूप में पंजीकरण करें',
    },
    'register.success': {
      en: 'We will verify and publish',
      ta: 'நாங்கள் சரிபார்த்து வெளியிடுவோம்',
      kn: 'ನಾವು ಪರಿಶೀಲಿಸಿ ಪ್ರಕಟಿಸುತ್ತೇವೆ',
      ml: 'ഞങ്ങൾ പരിശോധിച്ച് പ്രസിദ്ധീകരിക്കും',
      te: 'మేము ధృవీకరించి ప్రచురిస్తాము',
      hi: 'हम सत्यापित करेंगे और प्रकाशित करेंगे',
    },
    'footer.community': {
      en: 'This platform connects local communities directly.',
      ta: 'இந்த தளம் உள்ளூர் சமூகங்களை நேரடியாக இணைக்கிறது.',
      kn: 'ಈ ವೇದಿಕೆ ಸ್ಥಳೀಯ ಸಮುದಾಯಗಳನ್ನು ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
      ml: 'ഈ പ്ലാറ്റ്ഫോം പ്രാദേശിക സമൂഹങ്ങളെ നേരിട്ട് ബന്ധിപ്പിക്കുന്നു.',
      te: 'ఈ వేదిక స్థానిక సమాజాలను నేరుగా కలుపుతుంది.',
      hi: 'यह मंच स्थानीय समुदायों को सीधे जोड़ता है।',
    },
    'footer.nomiddleman': {
      en: 'No middleman',
      ta: 'இடைத்தரகர் இல்லை',
      kn: 'ಮಧ್ಯವರ್ತಿ ಇಲ್ಲ',
      ml: 'ഇടനിലക്കാരില്ല',
      te: 'మధ్యవర్తి లేదు',
      hi: 'कोई बिचौलिया नहीं',
    },
    'footer.nocommission': {
      en: 'No commission',
      ta: 'கமிஷன் இல்லை',
      kn: 'ಆಯೋಗವಿಲ್ಲ',
      ml: 'കമ്മീഷനില്ല',
      te: 'కమీషన్ లేదు',
      hi: 'कोई कमीशन नहीं',
    },
    'footer.contact': {
      en: 'Contact WhatsApp',
      ta: 'வாட்ஸ்அப் தொடர்பு',
      kn: 'ವಾಟ್ಸಾಪ್ ಸಂಪರ್ಕಿಸಿ',
      ml: 'വാട്ട്സാപ്പ് ബന്ധപ്പെടുക',
      te: 'వాట్సాప్ సంప్రదించండి',
      hi: 'व्हाट्सएप संपर्क करें',
    },
  };

  const entry = translations[key];
  if (!entry) {
    return { en: key, regional: key };
  }

  return {
    en: entry.en,
    regional: entry[lang] || entry.en,
  };
}
