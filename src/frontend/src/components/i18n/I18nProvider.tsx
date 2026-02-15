import { createContext, useContext, ReactNode } from 'react';

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
      en: 'AREA WORKARS',
      ta: 'ஏரியா வொர்க்கர்ஸ்',
      kn: 'ಏರಿಯಾ ವರ್ಕರ್ಸ್',
      ml: 'ഏരിയ വർക്കേഴ്സ്',
      te: 'ఏరియా వర్కర్స్',
      hi: 'एरिया वर्कर्स',
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
      en: 'Search by Area',
      ta: 'பகுதி மூலம் தேடுங்கள்',
      kn: 'ಪ್ರದೇಶದ ಮೂಲಕ ಹುಡುಕಿ',
      ml: 'പ്രദേശം വഴി തിരയുക',
      te: 'ప్రాంతం ద్వారా శోధించండి',
      hi: 'क्षेत्र द्वारा खोजें',
    },
    'hero.searchPlaceholder': {
      en: 'Enter Area or Pincode',
      ta: 'பகுதி அல்லது பின்கோடை உள்ளிடவும்',
      kn: 'ಪ್ರದೇಶ ಅಥವಾ ಪಿನ್‌ಕೋಡ್ ನಮೂದಿಸಿ',
      ml: 'പ്രദേശം അല്ലെങ്കിൽ പിൻകോഡ് നൽകുക',
      te: 'ప్రాంతం లేదా పిన్‌కోడ్ నమోదు చేయండి',
      hi: 'क्षेत्र या पिनकोड दर्ज करें',
    },
    'hero.searchButton': {
      en: 'Search',
      ta: 'தேடு',
      kn: 'ಹುಡುಕಿ',
      ml: 'തിരയുക',
      te: 'శోధించండి',
      hi: 'खोजें',
    },
    'home.browseCategories': {
      en: 'Browse by Category',
      ta: 'வகை வாரியாக உலாவவும்',
      kn: 'ವರ್ಗದ ಮೂಲಕ ಬ್ರೌಸ್ ಮಾಡಿ',
      ml: 'വിഭാഗം അനുസരിച്ച് ബ്രൗസ് ചെയ്യുക',
      te: 'వర్గం ద్వారా బ్రౌజ్ చేయండి',
      hi: 'श्रेणी द्वारा ब्राउज़ करें',
    },
    'nav.browse': {
      en: 'Browse Workers',
      ta: 'தொழிலாளர்களை உலாவவும்',
      kn: 'ಕಾರ್ಮಿಕರನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
      ml: 'തൊഴിലാളികളെ ബ്രൗസ് ചെയ്യുക',
      te: 'కార్మికులను బ్రౌజ్ చేయండి',
      hi: 'श्रमिकों को ब्राउज़ करें',
    },
    'nav.postJob': {
      en: 'Post Job',
      ta: 'வேலை இடுகை',
      kn: 'ಕೆಲಸ ಪೋಸ್ಟ್ ಮಾಡಿ',
      ml: 'ജോലി പോസ്റ്റ് ചെയ്യുക',
      te: 'ఉద్యోగం పోస్ట్ చేయండి',
      hi: 'नौकरी पोस्ट करें',
    },
    'nav.register': {
      en: 'Register as Worker',
      ta: 'தொழிலாளியாக பதிவு செய்யவும்',
      kn: 'ಕಾರ್ಮಿಕರಾಗಿ ನೋಂದಾಯಿಸಿ',
      ml: 'തൊഴിലാളിയായി രജിസ്റ്റർ ചെയ്യുക',
      te: 'కార్మికుడిగా నమోదు చేయండి',
      hi: 'श्रमिक के रूप में पंजीकरण करें',
    },
    'nav.admin': {
      en: 'Admin',
      ta: 'நிர்வாகி',
      kn: 'ನಿರ್ವಾಹಕ',
      ml: 'അഡ്മിൻ',
      te: 'అడ్మిన్',
      hi: 'व्यवस्थापक',
    },
    'nav.blog': {
      en: 'Blog',
      ta: 'வலைப்பதிவு',
      kn: 'ಬ್ಲಾಗ್',
      ml: 'ബ്ലോഗ്',
      te: 'బ్లాగ్',
      hi: 'ब्लॉग',
    },
    'admin.title': {
      en: 'Admin Panel',
      ta: 'நிர்வாக பலகம்',
      kn: 'ನಿರ್ವಾಹಕ ಫಲಕ',
      ml: 'അഡ്മിൻ പാനൽ',
      te: 'అడ్మిన్ ప్యానెల్',
      hi: 'व्यवस्थापक पैनल',
    },
    'admin.subtitle': {
      en: 'Review and manage worker registrations and job posts',
      ta: 'தொழிலாளர் பதிவுகள் மற்றும் வேலை இடுகைகளை மதிப்பாய்வு செய்து நிர்வகிக்கவும்',
      kn: 'ಕಾರ್ಮಿಕ ನೋಂದಣಿಗಳು ಮತ್ತು ಉದ್ಯೋಗ ಪೋಸ್ಟ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನಿರ್ವಹಿಸಿ',
      ml: 'തൊഴിലാളി രജിസ്ട്രേഷനുകളും ജോലി പോസ്റ്റുകളും അവലോകനം ചെയ്യുകയും നിയന്ത്രിക്കുകയും ചെയ്യുക',
      te: 'కార్మిక నమోదులు మరియు ఉద్యోగ పోస్ట్‌లను సమీక్షించండి మరియు నిర్వహించండి',
      hi: 'श्रमिक पंजीकरण और नौकरी पोस्ट की समीक्षा और प्रबंधन करें',
    },
    'admin.tab.workers': {
      en: 'Worker Reviews',
      ta: 'தொழிலாளர் மதிப்பாய்வுகள்',
      kn: 'ಕಾರ್ಮಿಕ ವಿಮರ್ಶೆಗಳು',
      ml: 'തൊഴിലാളി അവലോകനങ്ങൾ',
      te: 'కార్మిక సమీక్షలు',
      hi: 'श्रमिक समीक्षाएं',
    },
    'admin.tab.jobs': {
      en: 'Job Post Reviews',
      ta: 'வேலை இடுகை மதிப்பாய்வுகள்',
      kn: 'ಉದ್ಯೋಗ ಪೋಸ್ಟ್ ವಿಮರ್ಶೆಗಳು',
      ml: 'ജോലി പോസ്റ്റ് അവലോകനങ്ങൾ',
      te: 'ఉద్యోగ పోస్ట్ సమీక్షలు',
      hi: 'नौकरी पोस्ट समीक्षाएं',
    },
    'search.title': {
      en: 'Find Workers',
      ta: 'தொழிலாளர்களை கண்டுபிடிக்கவும்',
      kn: 'ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಿ',
      ml: 'തൊഴിലാളികളെ കണ്ടെത്തുക',
      te: 'కార్మికులను కనుగొనండి',
      hi: 'श्रमिकों को खोजें',
    },
    'search.filter.area': {
      en: 'Area',
      ta: 'பகுதி',
      kn: 'ಪ್ರದೇಶ',
      ml: 'പ്രദേശം',
      te: 'ప్రాంతం',
      hi: 'क्षेत्र',
    },
    'search.filter.category': {
      en: 'Category',
      ta: 'வகை',
      kn: 'ವರ್ಗ',
      ml: 'വിഭാഗം',
      te: 'వర్గం',
      hi: 'श्रेणी',
    },
    'search.filter.subcategory': {
      en: 'Subcategory',
      ta: 'துணை வகை',
      kn: 'ಉಪವರ್ಗ',
      ml: 'ഉപവിഭാഗം',
      te: 'ఉపవర్గం',
      hi: 'उपश्रेणी',
    },
    'search.placeholder.area': {
      en: 'Enter area or pincode',
      ta: 'பகுதி அல்லது பின்கோடை உள்ளிடவும்',
      kn: 'ಪ್ರದೇಶ ಅಥವಾ ಪಿನ್‌ಕೋಡ್ ನಮೂದಿಸಿ',
      ml: 'പ്രദേശം അല്ലെങ്കിൽ പിൻകോഡ് നൽകുക',
      te: 'ప్రాంతం లేదా పిన్‌కోడ్ నమోదు చేయండి',
      hi: 'क्षेत्र या पिनकोड दर्ज करें',
    },
    'search.select.category': {
      en: 'Select category',
      ta: 'வகையை தேர்ந்தெடுக்கவும்',
      kn: 'ವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      ml: 'വിഭാഗം തിരഞ്ഞെടുക്കുക',
      te: 'వర్గాన్ని ఎంచుకోండి',
      hi: 'श्रेणी चुनें',
    },
    'search.select.subcategory': {
      en: 'Select subcategory',
      ta: 'துணை வகையை தேர்ந்தெடுக்கவும்',
      kn: 'ಉಪವರ್ಗವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
      ml: 'ഉപവിഭാഗം തിരഞ്ഞെടുക്കുക',
      te: 'ఉపవర్గాన్ని ఎంచుకోండి',
      hi: 'उपश्रेणी चुनें',
    },
    'search.select.all': {
      en: 'All',
      ta: 'அனைத்தும்',
      kn: 'ಎಲ್ಲಾ',
      ml: 'എല്ലാം',
      te: 'అన్నీ',
      hi: 'सभी',
    },
    'search.button.search': {
      en: 'Search',
      ta: 'தேடு',
      kn: 'ಹುಡುಕಿ',
      ml: 'തിരയുക',
      te: 'శోధించండి',
      hi: 'खोजें',
    },
    'search.results.found': {
      en: 'workers found',
      ta: 'தொழிலாளர்கள் கிடைத்தனர்',
      kn: 'ಕಾರ್ಮಿಕರು ಕಂಡುಬಂದಿದ್ದಾರೆ',
      ml: 'തൊഴിലാളികൾ കണ്ടെത്തി',
      te: 'కార్మికులు దొరికారు',
      hi: 'श्रमिक मिले',
    },
    'search.results.none': {
      en: 'No workers found. Try adjusting your search filters.',
      ta: 'தொழிலாளர்கள் கிடைக்கவில்லை. உங்கள் தேடல் வடிப்பான்களை சரிசெய்ய முயற்சிக்கவும்.',
      kn: 'ಯಾವುದೇ ಕಾರ್ಮಿಕರು ಕಂಡುಬಂದಿಲ್ಲ. ನಿಮ್ಮ ಹುಡುಕಾಟ ಫಿಲ್ಟರ್‌ಗಳನ್ನು ಸರಿಹೊಂದಿಸಲು ಪ್ರಯತ್ನಿಸಿ.',
      ml: 'തൊഴിലാളികളെ കണ്ടെത്തിയില്ല. നിങ്ങളുടെ തിരയൽ ഫിൽട്ടറുകൾ ക്രമീകരിക്കാൻ ശ്രമിക്കുക.',
      te: 'కార్మికులు కనుగొనబడలేదు. మీ శోధన ఫిల్టర్‌లను సర్దుబాటు చేయడానికి ప్రయత్నించండి.',
      hi: 'कोई श्रमिक नहीं मिला। अपने खोज फ़िल्टर को समायोजित करने का प्रयास करें।',
    },
    'search.results.loading': {
      en: 'Searching for workers...',
      ta: 'தொழிலாளர்களை தேடுகிறது...',
      kn: 'ಕಾರ್ಮಿಕರನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
      ml: 'തൊഴിലാളികളെ തിരയുന്നു...',
      te: 'కార్మికుల కోసం వెతుకుతోంది...',
      hi: 'श्रमिकों की खोज की जा रही है...',
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
      ta: 'பொருட்கள்',
      kn: 'ಸರಬರಾಜುಗಳು',
      ml: 'സാധനങ്ങൾ',
      te: 'సామాగ్రి',
      hi: 'आपूर्ति',
    },
    'category.localSkilledWorkers': {
      en: 'Local Skilled Workers',
      ta: 'உள்ளூர் திறமையான தொழிலாளர்கள்',
      kn: 'ಸ್ಥಳೀಯ ನುರಿತ ಕಾರ್ಮಿಕರು',
      ml: 'പ്രാദേശിക വിദഗ്ധ തൊഴിലാളികൾ',
      te: 'స్థానిక నైపుణ్యం కలిగిన కార్మికులు',
      hi: 'स्थानीय कुशल श्रमिक',
    },
    'group.construction': {
      en: 'Construction',
      ta: 'கட்டுமானம்',
      kn: 'ನಿರ್ಮಾಣ',
      ml: 'നിർമ്മാണം',
      te: 'నిర్మాణం',
      hi: 'निर्माण',
    },
    'group.woodmetal': {
      en: 'Wood & Metal',
      ta: 'மரம் & உலோகம்',
      kn: 'ಮರ ಮತ್ತು ಲೋಹ',
      ml: 'മരവും ലോഹവും',
      te: 'చెక్క & లోహం',
      hi: 'लकड़ी और धातु',
    },
    'group.treework': {
      en: 'Tree Work',
      ta: 'மர வேலை',
      kn: 'ಮರದ ಕೆಲಸ',
      ml: 'മരം ജോലി',
      te: 'చెట్ల పని',
      hi: 'पेड़ का काम',
    },
    'group.homehelp': {
      en: 'Home Help',
      ta: 'வீட்டு உதவி',
      kn: 'ಮನೆ ಸಹಾಯ',
      ml: 'ഗൃഹ സഹായം',
      te: 'గృహ సహాయం',
      hi: 'घरेलू सहायता',
    },
    'group.tailoring': {
      en: 'Tailoring',
      ta: 'தையல்',
      kn: 'ಟೈಲರಿಂಗ್',
      ml: 'തയ്യൽ',
      te: 'టైలరింగ్',
      hi: 'दर्जी',
    },
    'group.agriculture': {
      en: 'Agriculture',
      ta: 'விவசாயம்',
      kn: 'ಕೃಷಿ',
      ml: 'കൃഷി',
      te: 'వ్యవసాయం',
      hi: 'कृषि',
    },
    'subcategory.mason': {
      en: 'Mason',
      ta: 'கொத்தனார்',
      kn: 'ಮೇಸನ್',
      ml: 'മേസൺ',
      te: 'మేసన్',
      hi: 'राजमिस्त्री',
    },
    'subcategory.cooliehelper': {
      en: 'Coolie Helper',
      ta: 'கூலி உதவியாளர்',
      kn: 'ಕೂಲಿ ಸಹಾಯಕ',
      ml: 'കൂലി സഹായി',
      te: 'కూలీ సహాయకుడు',
      hi: 'कुली सहायक',
    },
    'subcategory.centringworker': {
      en: 'Centring Worker',
      ta: 'சென்டரிங் தொழிலாளி',
      kn: 'ಸೆಂಟರಿಂಗ್ ಕಾರ್ಮಿಕ',
      ml: 'സെന്ററിംഗ് തൊഴിലാളി',
      te: 'సెంటరింగ్ కార్మికుడు',
      hi: 'सेंटरिंग कार्यकर्ता',
    },
    'subcategory.barbendingworker': {
      en: 'Bar Bending Worker',
      ta: 'பார் வளைக்கும் தொழிலாளி',
      kn: 'ಬಾರ್ ಬೆಂಡಿಂಗ್ ಕಾರ್ಮಿಕ',
      ml: 'ബാർ ബെൻഡിംഗ് തൊഴിലാളി',
      te: 'బార్ బెండింగ్ కార్మికుడు',
      hi: 'बार बेंडिंग कार्यकर्ता',
    },
    'subcategory.plasterworker': {
      en: 'Plaster Worker',
      ta: 'பிளாஸ்டர் தொழிலாளி',
      kn: 'ಪ್ಲಾಸ್ಟರ್ ಕಾರ್ಮಿಕ',
      ml: 'പ്ലാസ്റ്റർ തൊഴിലാളി',
      te: 'ప్లాస్టర్ కార్మికుడు',
      hi: 'प्लास्टर कार्यकर्ता',
    },
    'subcategory.tilesworker': {
      en: 'Tiles Worker',
      ta: 'ஓடு தொழிலாளி',
      kn: 'ಟೈಲ್ಸ್ ಕಾರ್ಮಿಕ',
      ml: 'ടൈൽസ് തൊഴിലാളി',
      te: 'టైల్స్ కార్మికుడు',
      hi: 'टाइल्स कार्यकर्ता',
    },
    'subcategory.painter': {
      en: 'Painter',
      ta: 'ஓவியர்',
      kn: 'ಪೇಂಟರ್',
      ml: 'പെയിന്റർ',
      te: 'పెయింటర్',
      hi: 'पेंटर',
    },
    'subcategory.carpenter': {
      en: 'Carpenter',
      ta: 'தச்சர்',
      kn: 'ಬಡಗಿ',
      ml: 'മരപ്പണിക്കാരൻ',
      te: 'వడ్రంగి',
      hi: 'बढ़ई',
    },
    'subcategory.doormaker': {
      en: 'Door Maker',
      ta: 'கதவு தயாரிப்பாளர்',
      kn: 'ಬಾಗಿಲು ತಯಾರಕ',
      ml: 'വാതിൽ നിർമ്മാതാവ്',
      te: 'తలుపు తయారీదారు',
      hi: 'दरवाजा निर्माता',
    },
    'subcategory.windowmaker': {
      en: 'Window Maker',
      ta: 'ஜன்னல் தயாரிப்பாளர்',
      kn: 'ಕಿಟಕಿ ತಯಾರಕ',
      ml: 'ജനൽ നിർമ്മാതാവ്',
      te: 'కిటికీ తయారీదారు',
      hi: 'खिड़की निर्माता',
    },
    'subcategory.grillfabricator': {
      en: 'Grill Fabricator',
      ta: 'கிரில் தயாரிப்பாளர்',
      kn: 'ಗ್ರಿಲ್ ತಯಾರಕ',
      ml: 'ഗ്രിൽ നിർമ്മാതാവ്',
      te: 'గ్రిల్ తయారీదారు',
      hi: 'ग्रिल निर्माता',
    },
    'subcategory.gatefabricator': {
      en: 'Gate Fabricator',
      ta: 'கேட் தயாரிப்பாளர்',
      kn: 'ಗೇಟ್ ತಯಾರಕ',
      ml: 'ഗേറ്റ് നിർമ്മാതാവ്',
      te: 'గేట్ తయారీదారు',
      hi: 'गेट निर्माता',
    },
    'subcategory.welder': {
      en: 'Welder',
      ta: 'வெல்டர்',
      kn: 'ವೆಲ್ಡರ್',
      ml: 'വെൽഡർ',
      te: 'వెల్డర్',
      hi: 'वेल्डर',
    },
    'subcategory.aluminiumworker': {
      en: 'Aluminium Worker',
      ta: 'அலுமினிய தொழிலாளி',
      kn: 'ಅಲ್ಯೂಮಿನಿಯಂ ಕಾರ್ಮಿಕ',
      ml: 'അലുമിനിയം തൊഴിലാളി',
      te: 'అల్యూమినియం కార్మికుడు',
      hi: 'एल्युमिनियम कार्यकर्ता',
    },
    'subcategory.treecutter': {
      en: 'Tree Cutter',
      ta: 'மர வெட்டுபவர்',
      kn: 'ಮರ ಕತ್ತರಿಸುವವರು',
      ml: 'മരം മുറിക്കുന്നവൻ',
      te: 'చెట్లు కోసేవాడు',
      hi: 'पेड़ काटने वाला',
    },
    'subcategory.coconuttreeclimber': {
      en: 'Coconut Tree Climber',
      ta: 'தென்னை மரம் ஏறுபவர்',
      kn: 'ತೆಂಗಿನ ಮರ ಏರುವವರು',
      ml: 'തെങ്ങ് കയറുന്നവൻ',
      te: 'కొబ్బరి చెట్టు ఎక్కేవాడు',
      hi: 'नारियल के पेड़ पर चढ़ने वाला',
    },
    'subcategory.coconutpicker': {
      en: 'Coconut Picker',
      ta: 'தென்னை பறிப்பவர்',
      kn: 'ತೆಂಗಿನಕಾಯಿ ಆರಿಸುವವರು',
      ml: 'തെങ്ങ് പറിക്കുന്നവൻ',
      te: 'కొబ్బరి కోసేవాడు',
      hi: 'नारियल तोड़ने वाला',
    },
    'subcategory.firewoodcutter': {
      en: 'Firewood Cutter',
      ta: 'விறகு வெட்டுபவர்',
      kn: 'ಉರುವಲು ಕತ್ತರಿಸುವವರು',
      ml: 'വിറക് മുറിക്കുന്നവൻ',
      te: 'కట్టెలు కోసేవాడు',
      hi: 'लकड़ी काटने वाला',
    },
    'subcategory.bushcleaning': {
      en: 'Bush Cleaning',
      ta: 'புதர் சுத்தம்',
      kn: 'ಪೊದೆ ಸ್ವಚ್ಛಗೊಳಿಸುವಿಕೆ',
      ml: 'കുറ്റിക്കാട് വൃത്തിയാക്കൽ',
      te: 'పొద శుభ్రపరచడం',
      hi: 'झाड़ी की सफाई',
    },
    'subcategory.housemaid': {
      en: 'House Maid',
      ta: 'வீட்டு வேலைக்காரி',
      kn: 'ಮನೆ ಸೇವಕಿ',
      ml: 'വീട്ടുജോലിക്കാരി',
      te: 'ఇంటి పనిమనిషి',
      hi: 'घरेलू नौकरानी',
    },
    'subcategory.onedaycooking': {
      en: 'One Day Cooking',
      ta: 'ஒரு நாள் சமையல்',
      kn: 'ಒಂದು ದಿನ ಅಡುಗೆ',
      ml: 'ഒരു ദിവസം പാചകം',
      te: 'ఒక రోజు వంట',
      hi: 'एक दिन की खाना पकाना',
    },
    'subcategory.functioncooking': {
      en: 'Function Cooking',
      ta: 'விழா சமையல்',
      kn: 'ಕಾರ್ಯಕ್ರಮ ಅಡುಗೆ',
      ml: 'ചടങ്ങ് പാചകം',
      te: 'కార్యక్రమ వంట',
      hi: 'समारोह खाना पकाना',
    },
    'subcategory.cleaningworker': {
      en: 'Cleaning Worker',
      ta: 'சுத்தம் செய்யும் தொழிலாளி',
      kn: 'ಸ್ವಚ್ಛಗೊಳಿಸುವ ಕಾರ್ಮಿಕ',
      ml: 'വൃത്തിയാക്കൽ തൊഴിലാളി',
      te: 'శుభ్రపరిచే కార్మికుడు',
      hi: 'सफाई कार्यकर्ता',
    },
    'subcategory.vesselwashing': {
      en: 'Vessel Washing',
      ta: 'பாத்திரம் கழுவுதல்',
      kn: 'ಪಾತ್ರೆ ತೊಳೆಯುವುದು',
      ml: 'പാത്രം കഴുകൽ',
      te: 'పాత్రలు కడగడం',
      hi: 'बर्तन धोना',
    },
    'subcategory.bathroomcleaning': {
      en: 'Bathroom Cleaning',
      ta: 'குளியலறை சுத்தம்',
      kn: 'ಸ್ನಾನಗೃಹ ಸ್ವಚ್ಛಗೊಳಿಸುವಿಕೆ',
      ml: 'കുളിമുറി വൃത്തിയാക്കൽ',
      te: 'బాత్రూమ్ శుభ్రపరచడం',
      hi: 'बाथरूम की सफाई',
    },
    'subcategory.tailor': {
      en: 'Tailor',
      ta: 'தையல்காரர்',
      kn: 'ಟೈಲರ್',
      ml: 'തയ്യൽക്കാരൻ',
      te: 'టైలర్',
      hi: 'दर्जी',
    },
    'subcategory.aariworker': {
      en: 'Aari Worker',
      ta: 'ஆரி வேலை செய்பவர்',
      kn: 'ಆರಿ ಕೆಲಸಗಾರ',
      ml: 'ആരി തൊഴിലാളി',
      te: 'ఆరి కార్మికుడు',
      hi: 'आरी कार्यकर्ता',
    },
    'subcategory.blousestitching': {
      en: 'Blouse Stitching',
      ta: 'ரவிக்கை தைத்தல்',
      kn: 'ಬ್ಲೌಸ್ ಹೊಲಿಗೆ',
      ml: 'ബ്ലൗസ് തയ്യൽ',
      te: 'బ్లౌజ్ కుట్టడం',
      hi: 'ब्लाउज सिलाई',
    },
    'subcategory.sareefallspico': {
      en: 'Saree Falls/Pico',
      ta: 'புடவை ஃபால்ஸ்/பிகோ',
      kn: 'ಸೀರೆ ಫಾಲ್ಸ್/ಪಿಕೋ',
      ml: 'സാരി ഫാൾസ്/പിക്കോ',
      te: 'చీర ఫాల్స్/పికో',
      hi: 'साड़ी फॉल्स/पिको',
    },
    'subcategory.ironingservice': {
      en: 'Ironing Service',
      ta: 'இஸ்திரி சேவை',
      kn: 'ಇಸ್ತ್ರಿ ಸೇವೆ',
      ml: 'ഇസ്തിരി സേവനം',
      te: 'ఇస్త్రీ సేవ',
      hi: 'इस्त्री सेवा',
    },
    'subcategory.farmlabour': {
      en: 'Farm Labour',
      ta: 'பண்ணை தொழிலாளி',
      kn: 'ಕೃಷಿ ಕಾರ್ಮಿಕ',
      ml: 'കൃഷി തൊഴിലാളി',
      te: 'వ్యవసాయ కార్మికుడు',
      hi: 'खेत मजदूर',
    },
    'subcategory.plantingworker': {
      en: 'Planting Worker',
      ta: 'நடவு தொழிலாளி',
      kn: 'ನೆಡುವ ಕಾರ್ಮಿಕ',
      ml: 'നടീൽ തൊഴിലാളി',
      te: 'నాటే కార్మికుడు',
      hi: 'रोपण कार्यकर्ता',
    },
    'subcategory.harvestworker': {
      en: 'Harvest Worker',
      ta: 'அறுவடை தொழிலாளி',
      kn: 'ಕೊಯ್ಲು ಕಾರ್ಮಿಕ',
      ml: 'വിളവെടുപ്പ് തൊഴിലാളി',
      te: 'పంట కోత కార్మికుడు',
      hi: 'फसल कार्यकर्ता',
    },
    'subcategory.sprayerworker': {
      en: 'Sprayer Worker',
      ta: 'தெளிப்பான் தொழிலாளி',
      kn: 'ಸ್ಪ್ರೇಯರ್ ಕಾರ್ಮಿಕ',
      ml: 'സ്പ്രേയർ തൊഴിലാളി',
      te: 'స్ప్రేయర్ కార్మికుడు',
      hi: 'स्प्रेयर कार्यकर्ता',
    },
    'subcategory.tractordriver': {
      en: 'Tractor Driver',
      ta: 'டிராக்டர் ஓட்டுநர்',
      kn: 'ಟ್ರಾಕ್ಟರ್ ಚಾಲಕ',
      ml: 'ട്രാക്ടർ ഡ്രൈവർ',
      te: 'ట్రాక్టర్ డ్రైవర్',
      hi: 'ट्रैक्टर चालक',
    },
    'footer.community': {
      en: 'Connecting local communities with skilled workers',
      ta: 'உள்ளூர் சமூகங்களை திறமையான தொழிலாளர்களுடன் இணைக்கிறது',
      kn: 'ಸ್ಥಳೀಯ ಸಮುದಾಯಗಳನ್ನು ನುರಿತ ಕಾರ್ಮಿಕರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುವುದು',
      ml: 'പ്രാദേശിക സമൂഹങ്ങളെ വിദഗ്ധ തൊഴിലാളികളുമായി ബന്ധിപ്പിക്കുന്നു',
      te: 'స్థానిక సమాజాలను నైపుణ్యం కలిగిన కార్మికులతో కనెక్ట్ చేస్తోంది',
      hi: 'स्थानीय समुदायों को कुशल श्रमिकों से जोड़ना',
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
      kn: 'ಆಯೋಗ ಇಲ್ಲ',
      ml: 'കമ്മീഷനില്ല',
      te: 'కమీషన్ లేదు',
      hi: 'कोई कमीशन नहीं',
    },
    'footer.contact': {
      en: 'Contact Us on WhatsApp',
      ta: 'வாட்ஸ்அப்பில் எங்களை தொடர்பு கொள்ளுங்கள்',
      kn: 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
      ml: 'വാട്ട്സാപ്പിൽ ഞങ്ങളെ ബന്ധപ്പെടുക',
      te: 'వాట్సాప్‌లో మమ్మల్ని సంప్రదించండి',
      hi: 'व्हाट्सएप पर हमसे संपर्क करें',
    },
  };

  const translation = translations[key];
  if (!translation) {
    // Return safe fallback with non-empty values
    return { en: key, regional: key };
  }

  const regionalText = translation[lang] || translation.en || key;
  const englishText = translation.en || key;

  return {
    en: englishText,
    regional: regionalText,
  };
}
