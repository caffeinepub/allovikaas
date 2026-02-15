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

  // Registration - Field Labels
  'register.title': {
    en: 'Register as Worker',
    ta: 'தொழிலாளியாக பதிவு செய்யவும்',
  },
  'register.subtitle': {
    en: 'Join our network of skilled workers',
    ta: 'திறமையான தொழிலாளர்களின் எங்கள் வலையமைப்பில் சேரவும்',
  },
  'register.field.name': {
    en: 'Name',
    ta: 'பெயர்',
  },
  'register.field.phone': {
    en: 'Phone Number',
    ta: 'தொலைபேசி எண்',
  },
  'register.field.category': {
    en: 'Category',
    ta: 'பணி வகை',
  },
  'register.field.subcategory': {
    en: 'Sub Category',
    ta: 'உப வகை',
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
  'register.field.skills': {
    en: 'Description',
    ta: 'விவரம்',
  },
  'register.field.comments': {
    en: 'Comments',
    ta: 'கருத்துகள்',
  },

  // Registration - Placeholders
  'register.placeholder.name': {
    en: 'Enter your full name',
    ta: 'உங்கள் முழு பெயரை உள்ளிடவும்',
  },
  'register.placeholder.phone': {
    en: 'Enter 10-digit phone number',
    ta: '10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்',
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
  'register.placeholder.skills': {
    en: 'Describe your work and skills',
    ta: 'உங்கள் வேலை மற்றும் திறன்களை விவரிக்கவும்',
  },
  'register.placeholder.comments': {
    en: 'Any additional information',
    ta: 'கூடுதல் தகவல்கள்',
  },

  // Registration - Select Options
  'register.select.category': {
    en: 'Select a category',
    ta: 'ஒரு வகையைத் தேர்ந்தெடுக்கவும்',
  },
  'register.select.subcategory': {
    en: 'Select a subcategory',
    ta: 'ஒரு துணை வகையைத் தேர்ந்தெடுக்கவும்',
  },
  'register.select.categoryFirst': {
    en: 'Select category first',
    ta: 'முதலில் வகையைத் தேர்ந்தெடுக்கவும்',
  },
  'register.loading.categories': {
    en: 'Loading categories...',
    ta: 'வகைகள் ஏற்றப்படுகின்றன...',
  },

  // Registration - Buttons
  'register.button.choosePhoto': {
    en: 'Choose Photo',
    ta: 'புகைப்படத்தைத் தேர்ந்தெடுக்கவும்',
  },
  'register.button.submit': {
    en: 'Submit Registration',
    ta: 'பதிவை சமர்ப்பிக்கவும்',
  },
  'register.button.submitting': {
    en: 'Submitting...',
    ta: 'சமர்ப்பிக்கப்படுகிறது...',
  },

  // Registration - Errors
  'register.error.nameRequired': {
    en: 'Name is required',
    ta: 'பெயர் தேவை',
  },
  'register.error.phoneRequired': {
    en: 'Phone number is required',
    ta: 'தொலைபேசி எண் தேவை',
  },
  'register.error.phoneInvalid': {
    en: 'Please enter a valid 10-digit phone number',
    ta: 'சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்',
  },
  'register.error.categoryRequired': {
    en: 'Category is required',
    ta: 'வகை தேவை',
  },
  'register.error.subcategoryRequired': {
    en: 'Subcategory is required',
    ta: 'துணை வகை தேவை',
  },
  'register.error.areaRequired': {
    en: 'Area is required',
    ta: 'பகுதி தேவை',
  },
  'register.error.photoRequired': {
    en: 'Photo is required',
    ta: 'புகைப்படம் தேவை',
  },

  // Registration - Helper Text
  'register.helper': {
    en: 'Fill in your details to join our worker network',
    ta: 'எங்கள் தொழிலாளர் வலையமைப்பில் சேர உங்கள் விவரங்களை நிரப்பவும்',
  },

  // Legacy keys for backward compatibility
  'register.form.name': {
    en: 'Name',
    ta: 'பெயர்',
  },
  'register.form.phone': {
    en: 'Phone Number',
    ta: 'தொலைபேசி எண்',
  },
  'register.form.category': {
    en: 'Category',
    ta: 'பணி வகை',
  },
  'register.form.subcategory': {
    en: 'Sub Category',
    ta: 'உப வகை',
  },
  'register.form.area': {
    en: 'Area',
    ta: 'பகுதி',
  },
  'register.form.experience': {
    en: 'Experience',
    ta: 'அனுபவம்',
  },
  'register.form.workingHours': {
    en: 'Working Hours',
    ta: 'வேலை நேரம்',
  },
  'register.form.photo': {
    en: 'Photo',
    ta: 'புகைப்படம்',
  },
  'register.form.skills': {
    en: 'Description',
    ta: 'விவரம்',
  },
  'register.form.comments': {
    en: 'Comments',
    ta: 'கருத்துகள்',
  },
  'register.form.submit': {
    en: 'Submit Registration',
    ta: 'பதிவை சமர்ப்பிக்கவும்',
  },

  // Worker card
  'worker.availability.callToConfirm': {
    en: 'Call to confirm availability',
    ta: 'கிடைக்கும் தன்மையை உறுதிப்படுத்த அழைக்கவும்',
  },
  'worker.trust.verified': {
    en: 'Verified',
    ta: 'சரிபார்க்கப்பட்டது',
  },
  'worker.trust.recentlyActive': {
    en: 'Recently Active',
    ta: 'சமீபத்தில் செயலில்',
  },
  'worker.action.call': {
    en: 'Call',
    ta: 'அழை',
  },
  'worker.action.whatsapp': {
    en: 'WhatsApp',
    ta: 'வாட்ஸ்அப்',
  },

  // Worker profile
  'worker.profile.name': {
    en: 'Name',
    ta: 'பெயர்',
  },
  'worker.profile.work': {
    en: 'Work',
    ta: 'வேலை',
  },
  'worker.profile.area': {
    en: 'Area',
    ta: 'பகுதி',
  },
  'worker.profile.experience': {
    en: 'Experience',
    ta: 'அனுபவம்',
  },
  'worker.profile.workDescription': {
    en: 'Work Description',
    ta: 'வேலை விவரம்',
  },
  'worker.profile.availableTime': {
    en: 'Available Time',
    ta: 'கிடைக்கும் நேரம்',
  },
  'worker.profile.languages': {
    en: 'Languages Spoken',
    ta: 'பேசும் மொழிகள்',
  },
  'worker.profile.loading': {
    en: 'Loading worker profile...',
    ta: 'தொழிலாளி சுயவிவரம் ஏற்றப்படுகிறது...',
  },
  'worker.profile.notFound': {
    en: 'Worker not found',
    ta: 'தொழிலாளி கிடைக்கவில்லை',
  },

  // Search
  'search.title': {
    en: 'Search Results',
    ta: 'தேடல் முடிவுகள்',
  },
  'search.noResults': {
    en: 'No workers found',
    ta: 'தொழிலாளர்கள் கிடைக்கவில்லை',
  },
  'search.loading': {
    en: 'Searching...',
    ta: 'தேடுகிறது...',
  },

  // Job posting
  'job.post.title': {
    en: 'Post a Job',
    ta: 'வேலை இடுகை',
  },
  'job.post.subtitle': {
    en: 'Find workers for your needs',
    ta: 'உங்கள் தேவைகளுக்கு தொழிலாளர்களை கண்டுபிடிக்கவும்',
  },
  'job.post.form.workType': {
    en: 'Work Type',
    ta: 'வேலை வகை',
  },
  'job.post.form.area': {
    en: 'Area',
    ta: 'பகுதி',
  },
  'job.post.form.dateTime': {
    en: 'Date & Time',
    ta: 'தேதி மற்றும் நேரம்',
  },
  'job.post.form.salary': {
    en: 'Salary',
    ta: 'சம்பளம்',
  },
  'job.post.form.description': {
    en: 'Description',
    ta: 'விவரம்',
  },
  'job.post.form.phone': {
    en: 'Phone',
    ta: 'தொலைபேசி',
  },
  'job.post.form.submit': {
    en: 'Post Job',
    ta: 'வேலை இடுகை',
  },

  // Admin
  'admin.title': {
    en: 'Admin Panel',
    ta: 'நிர்வாக பலகம்',
  },
  'admin.subtitle': {
    en: 'Manage workers and job posts',
    ta: 'தொழிலாளர்கள் மற்றும் வேலை இடுகைகளை நிர்வகிக்கவும்',
  },
  'admin.tabs.workers': {
    en: 'Workers',
    ta: 'தொழிலாளர்கள்',
  },
  'admin.tabs.jobs': {
    en: 'Jobs',
    ta: 'வேலைகள்',
  },

  // Footer
  'footer.attribution': {
    en: 'Built with love using caffeine.ai',
    ta: 'காஃபின்.ai பயன்படுத்தி அன்புடன் உருவாக்கப்பட்டது',
  },
  'footer.contact': {
    en: 'Contact Us',
    ta: 'எங்களை தொடர்பு கொள்ளவும்',
  },
};

/**
 * Humanizes a raw key by converting it to Title Case
 * Used as fallback when translation is missing
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
