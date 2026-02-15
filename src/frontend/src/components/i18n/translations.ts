// Local hardcoded translation dictionary
// All translations are stored here - no external loaders

export type TranslationKey = string;

export interface BilingualValue {
  en: string;
  ta: string;
}

// Main translation dictionary
export const translations: Record<TranslationKey, BilingualValue> = {
  // App
  'app.name': {
    en: 'AREA WORKARS',
    ta: 'ஏரியா வொர்க்கர்ஸ்',
  },
  'app.tagline': {
    en: 'Find People Who Work Near You',
    ta: 'உங்கள் அருகில் வேலை செய்யும் நபர்களை கண்டுபிடிக்கவும்',
  },

  // Home page
  'home.hero.title': {
    en: 'Find Local Workers',
    ta: 'உள்ளூர் தொழிலாளர்களை கண்டுபிடிக்கவும்',
  },
  'home.hero.subtitle': {
    en: 'Connect with skilled workers in your area',
    ta: 'உங்கள் பகுதியில் திறமையான தொழிலாளர்களுடன் இணைக்கவும்',
  },
  'home.hero.searchPlaceholder': {
    en: 'Search work or area',
    ta: 'வேலை அல்லது பகுதி தேடுங்கள்',
  },
  'home.hero.searchButton': {
    en: 'Search',
    ta: 'தேடு',
  },
  'home.search.placeholder': {
    en: 'Search work or area',
    ta: 'வேலை அல்லது பகுதி தேடுங்கள்',
  },
  'home.browseCategories': {
    en: 'Browse by Category',
    ta: 'வகை வாரியாக உலாவவும்',
  },
  'home.categories.title': {
    en: 'Browse by Category',
    ta: 'வகை வாரியாக உலாவவும்',
  },

  // Navigation
  'nav.browse': {
    en: 'Browse Workers',
    ta: 'தொழிலாளர்களை உலாவவும்',
  },
  'nav.postJob': {
    en: 'Post Job',
    ta: 'வேலை இடுகை',
  },
  'nav.register': {
    en: 'Register as Worker',
    ta: 'தொழிலாளியாக பதிவு செய்யவும்',
  },
  'nav.admin': {
    en: 'Admin',
    ta: 'நிர்வாகி',
  },
  'nav.blog': {
    en: 'Blog',
    ta: 'வலைப்பதிவு',
  },

  // Registration page
  'register.title': {
    en: 'Register as Worker',
    ta: 'தொழிலாளராக பதிவு செய்யவும்',
  },
  'register.helper': {
    en: 'Fill in your details to join our network',
    ta: 'எங்கள் வலையமைப்பில் சேர உங்கள் விவரங்களை நிரப்பவும்',
  },

  // Registration form fields
  'register.field.name': {
    en: 'Full Name',
    ta: 'முழு பெயர்',
  },
  'register.field.phone': {
    en: 'Phone Number',
    ta: 'தொலைபேசி எண்',
  },
  'register.field.category': {
    en: 'Category',
    ta: 'வகை',
  },
  'register.field.subcategory': {
    en: 'Specialty',
    ta: 'சிறப்பு',
  },
  'register.field.area': {
    en: 'Area',
    ta: 'பகுதி',
  },
  'register.field.experience': {
    en: 'Experience',
    ta: 'அனுபவம்',
  },
  'register.field.workingHours': {
    en: 'Working Hours',
    ta: 'வேலை நேரம்',
  },
  'register.field.photo': {
    en: 'Photo',
    ta: 'புகைப்படம்',
  },
  'register.field.comments': {
    en: 'Additional Comments',
    ta: 'கூடுதல் கருத்துகள்',
  },
  'register.field.skills': {
    en: 'Skills / Work Tags',
    ta: 'திறன்கள் / வேலை குறிச்சொற்கள்',
  },

  // Registration placeholders
  'register.placeholder.name': {
    en: 'Enter your full name',
    ta: 'உங்கள் முழு பெயரை உள்ளிடவும்',
  },
  'register.placeholder.phone': {
    en: '10-digit phone number',
    ta: '10 இலக்க தொலைபேசி எண்',
  },
  'register.placeholder.area': {
    en: 'Enter your area or locality',
    ta: 'உங்கள் பகுதி அல்லது இடத்தை உள்ளிடவும்',
  },
  'register.placeholder.experience': {
    en: 'e.g., 5 years',
    ta: 'எ.கா., 5 ஆண்டுகள்',
  },
  'register.placeholder.workingHours': {
    en: 'e.g., 9 AM - 6 PM',
    ta: 'எ.கா., காலை 9 - மாலை 6',
  },
  'register.placeholder.comments': {
    en: 'Any additional information',
    ta: 'ஏதேனும் கூடுதல் தகவல்',
  },
  'register.placeholder.skills': {
    en: 'Enter skills separated by commas',
    ta: 'திறன்களை காற்புள்ளியால் பிரித்து உள்ளிடவும்',
  },

  // Registration select options
  'register.select.category': {
    en: 'Select a category',
    ta: 'ஒரு வகையை தேர்ந்தெடுக்கவும்',
  },
  'register.select.subcategory': {
    en: 'Select a specialty',
    ta: 'ஒரு சிறப்பை தேர்ந்தெடுக்கவும்',
  },
  'register.select.categoryFirst': {
    en: 'Select category first',
    ta: 'முதலில் வகையை தேர்ந்தெடுக்கவும்',
  },

  // Registration loading states
  'register.loading.categories': {
    en: 'Loading categories...',
    ta: 'வகைகளை ஏற்றுகிறது...',
  },

  // Registration buttons
  'register.button.choosePhoto': {
    en: 'Choose Photo',
    ta: 'புகைப்படத்தை தேர்ந்தெடுக்கவும்',
  },
  'register.button.submit': {
    en: 'Submit Registration',
    ta: 'பதிவை சமர்ப்பிக்கவும்',
  },
  'register.button.submitting': {
    en: 'Submitting...',
    ta: 'சமர்ப்பிக்கிறது...',
  },

  // Registration messages
  'register.success': {
    en: 'Registration submitted successfully!',
    ta: 'பதிவு வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!',
  },
  'register.error': {
    en: 'Failed to submit registration',
    ta: 'பதிவை சமர்ப்பிக்க முடியவில்லை',
  },

  // Search page
  'search.title': {
    en: 'Search Workers',
    ta: 'தொழிலாளர்களை தேடுங்கள்',
  },

  // Search empty state
  'search.empty.message': {
    en: 'No workers found in your area yet. Try searching in nearby areas or post a work request.',
    ta: 'உங்கள் பகுதியில் வேலைக்காரர்கள் இன்னும் சேரவில்லை. அருகிலுள்ள பகுதிகளில் தேடலாம் அல்லது வேலை பதிவு செய்யலாம்.',
  },
  'search.empty.nearby.title': {
    en: 'Workers Near You',
    ta: 'உங்களுக்கு அருகில் உள்ள தொழிலாளர்கள்',
  },
  'search.empty.suggestions.title': {
    en: 'Related Suggestions',
    ta: 'தொடர்புடைய பரிந்துரைகள்',
  },
  'search.empty.action.postJob': {
    en: 'Post a Work Request',
    ta: 'வேலை கோரிக்கை இடுங்கள்',
  },
  'search.empty.action.expandSearch': {
    en: 'Expand Search Area',
    ta: 'தேடல் பகுதியை விரிவாக்கவும்',
  },
  'search.empty.whatsapp.prompt': {
    en: 'Need immediate help?',
    ta: 'உங்களுக்கு உடனடி உதவி வேண்டுமா?',
  },
  'search.empty.whatsapp.button': {
    en: 'WhatsApp Help',
    ta: 'வாட்ஸ்அப் உதவி',
  },

  // Job posting page
  'job.title': {
    en: 'Post a Job',
    ta: 'வேலை இடுகை',
  },
  'job.helper': {
    en: 'Fill in the job details',
    ta: 'வேலை விவரங்களை நிரப்பவும்',
  },

  // Job form fields
  'job.field.workType': {
    en: 'Work Type',
    ta: 'வேலை வகை',
  },
  'job.field.area': {
    en: 'Area',
    ta: 'பகுதி',
  },
  'job.field.dateTime': {
    en: 'Date & Time',
    ta: 'தேதி மற்றும் நேரம்',
  },
  'job.field.salary': {
    en: 'Salary',
    ta: 'சம்பளம்',
  },
  'job.field.description': {
    en: 'Description',
    ta: 'விளக்கம்',
  },
  'job.field.phone': {
    en: 'Contact Phone',
    ta: 'தொடர்பு தொலைபேசி',
  },

  // Job placeholders
  'job.placeholder.workType': {
    en: 'e.g., Plumber, Electrician',
    ta: 'எ.கா., குழாய் பழுதுபார்ப்பவர், மின்சாரம்',
  },
  'job.placeholder.area': {
    en: 'Enter area or locality',
    ta: 'பகுதி அல்லது இடத்தை உள்ளிடவும்',
  },
  'job.placeholder.salary': {
    en: 'e.g., ₹500/day',
    ta: 'எ.கா., ₹500/நாள்',
  },
  'job.placeholder.description': {
    en: 'Describe the work needed',
    ta: 'தேவையான வேலையை விவரிக்கவும்',
  },
  'job.placeholder.phone': {
    en: '10-digit phone number',
    ta: '10 இலக்க தொலைபேசி எண்',
  },

  // Job buttons
  'job.button.submit': {
    en: 'Post Job',
    ta: 'வேலை இடுகை',
  },
  'job.button.submitting': {
    en: 'Posting...',
    ta: 'இடுகையிடுகிறது...',
  },

  // Job messages
  'job.success': {
    en: 'Job posted successfully!',
    ta: 'வேலை வெற்றிகரமாக இடுகையிடப்பட்டது!',
  },
  'job.error': {
    en: 'Failed to post job',
    ta: 'வேலையை இடுகையிட முடியவில்லை',
  },

  // Admin panel
  'admin.title': {
    en: 'Admin Panel',
    ta: 'நிர்வாக பலகம்',
  },
  'admin.subtitle': {
    en: 'Manage workers and job posts',
    ta: 'தொழிலாளர்கள் மற்றும் வேலை இடுகைகளை நிர்வகிக்கவும்',
  },
  'admin.tab.workers': {
    en: 'Workers',
    ta: 'தொழிலாளர்கள்',
  },
  'admin.tab.jobs': {
    en: 'Job Posts',
    ta: 'வேலை இடுகைகள்',
  },

  // Categories
  'category.construction': {
    en: 'Construction',
    ta: 'கட்டுமானம்',
  },
  'category.agriculture': {
    en: 'Agriculture',
    ta: 'விவசாயம்',
  },
  'category.homeServices': {
    en: 'Home Services',
    ta: 'வீட்டு சேவைகள்',
  },
  'category.transport': {
    en: 'Transport',
    ta: 'போக்குவரத்து',
  },
  'category.eventWork': {
    en: 'Events & Cooking',
    ta: 'நிகழ்வுகள் மற்றும் சமையல்',
  },
  'category.dailyHelpers': {
    en: 'Daily Helpers',
    ta: 'தினசரி உதவியாளர்கள்',
  },
  'category.repairs': {
    en: 'Repairs',
    ta: 'பழுதுபார்ப்பு',
  },
  'category.supplies': {
    en: 'Supplies',
    ta: 'பொருட்கள்',
  },
  'category.tailoring': {
    en: 'Tailoring',
    ta: 'தையல்',
  },
  'category.localSkilledWorkers': {
    en: 'Local Skilled Workers',
    ta: 'உள்ளூர் திறமையான தொழிலாளர்கள்',
  },

  // Subcategories - Construction
  'subcategory.mason': {
    en: 'Mason',
    ta: 'கொத்தனார்',
  },
  'subcategory.cooliehelper': {
    en: 'Coolie/Helper',
    ta: 'கூலி/உதவியாளர்',
  },
  'subcategory.centringworker': {
    en: 'Centring Worker',
    ta: 'சென்டரிங் தொழிலாளி',
  },
  'subcategory.barbendingworker': {
    en: 'Bar Bending Worker',
    ta: 'பார் பெண்டிங் தொழிலாளி',
  },
  'subcategory.doormaker': {
    en: 'Door Maker',
    ta: 'கதவு தயாரிப்பாளர்',
  },
  'subcategory.windowmaker': {
    en: 'Window Maker',
    ta: 'ஜன்னல் தயாரிப்பாளர்',
  },
  'subcategory.carpenter': {
    en: 'Carpenter',
    ta: 'தச்சர்',
  },
  'subcategory.grillgatefabricator': {
    en: 'Grill/Gate Fabricator',
    ta: 'கிரில்/கேட் தயாரிப்பாளர்',
  },
  'subcategory.welder': {
    en: 'Welder',
    ta: 'வெல்டர்',
  },

  // Subcategories - Agriculture
  'subcategory.treecutter': {
    en: 'Tree Cutter',
    ta: 'மரம் வெட்டுபவர்',
  },
  'subcategory.coconuttreeclimber': {
    en: 'Coconut Tree Climber',
    ta: 'தென்னை மரம் ஏறுபவர்',
  },
  'subcategory.coconutpicker': {
    en: 'Coconut Picker',
    ta: 'தேங்காய் பறிப்பவர்',
  },
  'subcategory.firewoodcutter': {
    en: 'Firewood Cutter',
    ta: 'விறகு வெட்டுபவர்',
  },
  'subcategory.basketmaker': {
    en: 'Basket Maker',
    ta: 'கூடை தயாரிப்பாளர்',
  },
  'subcategory.ropemaker': {
    en: 'Rope Maker',
    ta: 'கயிறு தயாரிப்பாளர்',
  },
  'subcategory.matweaver': {
    en: 'Mat Weaver',
    ta: 'பாய் நெசவாளர்',
  },
  'subcategory.potmaker': {
    en: 'Pot Maker',
    ta: 'பானை தயாரிப்பாளர்',
  },

  // Subcategories - Home Services
  'subcategory.housemaid': {
    en: 'House Maid',
    ta: 'வீட்டு வேலைக்காரி',
  },
  'subcategory.onedaycookingworker': {
    en: 'One Day Cooking Worker',
    ta: 'ஒரு நாள் சமையல் தொழிலாளி',
  },
  'subcategory.functioncookingteam': {
    en: 'Function Cooking Team',
    ta: 'விழா சமையல் குழு',
  },
  'subcategory.cleaningworker': {
    en: 'Cleaning Worker',
    ta: 'சுத்தம் செய்யும் தொழிலாளி',
  },

  // Subcategories - Tailoring
  'subcategory.tailor': {
    en: 'Tailor',
    ta: 'தையல்காரர்',
  },
  'subcategory.aariworker': {
    en: 'Aari Worker',
    ta: 'ஆரி வேலை செய்பவர்',
  },
  'subcategory.blousedesigner': {
    en: 'Blouse Designer',
    ta: 'ரவிக்கை வடிவமைப்பாளர்',
  },
  'subcategory.sareestitching': {
    en: 'Saree Stitching',
    ta: 'புடவை தையல்',
  },
  'subcategory.blousestitching': {
    en: 'Blouse Stitching',
    ta: 'ரவிக்கை தையல்',
  },
  'subcategory.sareework': {
    en: 'Saree Work',
    ta: 'புடவை வேலை',
  },
  'subcategory.sareefallspicoworker': {
    en: 'Saree Falls/Pico Worker',
    ta: 'புடவை ஃபால்ஸ்/பிகோ தொழிலாளி',
  },
  'subcategory.sareefallspico': {
    en: 'Saree Falls/Pico',
    ta: 'புடவை ஃபால்ஸ்/பிகோ',
  },
  'subcategory.ironingservice': {
    en: 'Ironing Service',
    ta: 'இஸ்திரி சேவை',
  },

  // Subcategories - Agriculture (additional)
  'subcategory.farmlabour': {
    en: 'Farm Labour',
    ta: 'விவசாய தொழிலாளி',
  },
  'subcategory.plantingworker': {
    en: 'Planting Worker',
    ta: 'நடவு தொழிலாளி',
  },
  'subcategory.harvestworker': {
    en: 'Harvest Worker',
    ta: 'அறுவடை தொழிலாளி',
  },
  'subcategory.sprayerworker': {
    en: 'Sprayer Worker',
    ta: 'தெளிப்பு தொழிலாளி',
  },

  // Subgroups
  'subgroup.construction': {
    en: 'Masonry Work',
    ta: 'கொத்து வேலை',
  },
  'subgroup.woodmetal': {
    en: 'Wood & Metal Work',
    ta: 'மரம் & உலோக வேலை',
  },
  'subgroup.treework': {
    en: 'Tree Work',
    ta: 'மர வேலை',
  },
  'subgroup.homehelp': {
    en: 'Home Help',
    ta: 'வீட்டு உதவி',
  },
  'subgroup.tailoring': {
    en: 'Tailoring',
    ta: 'தையல்',
  },
  'subgroup.agriculture': {
    en: 'Agriculture',
    ta: 'விவசாயம்',
  },

  // Worker card
  'worker.availability.available': {
    en: 'Available Now',
    ta: 'இப்போது கிடைக்கும்',
  },
  'worker.availability.busy': {
    en: 'Currently Busy',
    ta: 'தற்போது பிஸி',
  },
  'worker.availability.callToConfirm': {
    en: 'Call to confirm availability',
    ta: 'கிடைக்கும் தன்மையை உறுதிப்படுத்த அழைக்கவும்',
  },
  'worker.trust.verified': {
    en: 'Verified Number',
    ta: 'சரிபார்க்கப்பட்ட எண்',
  },
  'worker.trust.recentlyActive': {
    en: 'Recently Active',
    ta: 'சமீபத்தில் செயலில்',
  },
  'worker.action.whatsapp': {
    en: 'WhatsApp',
    ta: 'வாட்ஸ்அப்',
  },
  'worker.action.call': {
    en: 'Call',
    ta: 'அழை',
  },
};

// Helper function to get translation by key and return with 'regional' property
export function getTranslation(key: TranslationKey): { en: string; regional: string } {
  const translation = translations[key];
  
  if (!translation) {
    // Return a safe fallback instead of throwing
    console.warn(`Translation missing for key: ${key}`);
    return {
      en: key,
      regional: key,
    };
  }
  
  // Map 'ta' to 'regional' for compatibility
  return {
    en: translation.en,
    regional: translation.ta,
  };
}
