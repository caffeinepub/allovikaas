export const LOCAL_SKILLED_WORKERS_CATEGORY = 'Local Skilled Workers';

export interface LocalSkilledWorker {
  subcategory: string;
  icon: string;
  label: {
    en: string;
    regional: string;
  };
}

// Normalize subcategory key for robust matching
function normalizeSubcategoryKey(key: string): string {
  return key.toLowerCase().trim().replace(/\s+/g, '').replace(/\//g, '').replace(/-/g, '');
}

const localSkilledWorkers: LocalSkilledWorker[] = [
  {
    subcategory: 'Mason',
    icon: '/assets/generated/icon-mason.dim_128x128.svg',
    label: { en: 'Mason', regional: 'கொத்தனார்' },
  },
  {
    subcategory: 'Coolie/Helper',
    icon: '/assets/generated/icon-coolie-helper.dim_128x128.svg',
    label: { en: 'Coolie/Helper', regional: 'கூலி/உதவியாளர்' },
  },
  {
    subcategory: 'Centring Worker',
    icon: '/assets/generated/icon-centring-worker.dim_128x128.svg',
    label: { en: 'Centring Worker', regional: 'சென்டரிங் தொழிலாளி' },
  },
  {
    subcategory: 'Bar Bending Worker',
    icon: '/assets/generated/icon-bar-bending-worker.dim_128x128.svg',
    label: { en: 'Bar Bending Worker', regional: 'பார் பெண்டிங் தொழிலாளி' },
  },
  {
    subcategory: 'Door Maker',
    icon: '/assets/generated/icon-door-maker.dim_128x128.svg',
    label: { en: 'Door Maker', regional: 'கதவு தயாரிப்பாளர்' },
  },
  {
    subcategory: 'Window Maker',
    icon: '/assets/generated/icon-window-maker.dim_128x128.svg',
    label: { en: 'Window Maker', regional: 'ஜன்னல் தயாரிப்பாளர்' },
  },
  {
    subcategory: 'Carpenter',
    icon: '/assets/generated/icon-carpenter.dim_128x128.svg',
    label: { en: 'Carpenter', regional: 'தச்சர்' },
  },
  {
    subcategory: 'Grill/Gate Fabricator',
    icon: '/assets/generated/icon-grill-gate-fabricator.dim_128x128.svg',
    label: { en: 'Grill/Gate Fabricator', regional: 'கிரில்/கேட் தயாரிப்பாளர்' },
  },
  {
    subcategory: 'Welder',
    icon: '/assets/generated/icon-welder.dim_128x128.svg',
    label: { en: 'Welder', regional: 'வெல்டர்' },
  },
  {
    subcategory: 'Tree Cutter',
    icon: '/assets/generated/icon-tree-cutter.dim_128x128.svg',
    label: { en: 'Tree Cutter', regional: 'மரம் வெட்டுபவர்' },
  },
  {
    subcategory: 'Coconut Tree Climber',
    icon: '/assets/generated/icon-coconut-tree-climber.dim_128x128.svg',
    label: { en: 'Coconut Tree Climber', regional: 'தென்னை மரம் ஏறுபவர்' },
  },
  {
    subcategory: 'Coconut Picker',
    icon: '/assets/generated/icon-coconut-picker.dim_128x128.svg',
    label: { en: 'Coconut Picker', regional: 'தேங்காய் பறிப்பவர்' },
  },
  {
    subcategory: 'Firewood Cutter',
    icon: '/assets/generated/icon-firewood-cutter.dim_128x128.svg',
    label: { en: 'Firewood Cutter', regional: 'விறகு வெட்டுபவர்' },
  },
  {
    subcategory: 'Basket Maker',
    icon: '/assets/generated/icon-basket-maker.dim_128x128.svg',
    label: { en: 'Basket Maker', regional: 'கூடை தயாரிப்பாளர்' },
  },
  {
    subcategory: 'Rope Maker',
    icon: '/assets/generated/icon-rope-maker.dim_128x128.svg',
    label: { en: 'Rope Maker', regional: 'கயிறு தயாரிப்பாளர்' },
  },
  {
    subcategory: 'Mat Weaver',
    icon: '/assets/generated/icon-mat-weaver.dim_128x128.svg',
    label: { en: 'Mat Weaver', regional: 'பாய் நெசவாளர்' },
  },
  {
    subcategory: 'Pot Maker',
    icon: '/assets/generated/icon-pot-maker.dim_128x128.svg',
    label: { en: 'Pot Maker', regional: 'பானை தயாரிப்பாளர்' },
  },
  {
    subcategory: 'House Maid',
    icon: '/assets/generated/icon-house-maid.dim_128x128.svg',
    label: { en: 'House Maid', regional: 'வீட்டு வேலையாள்' },
  },
  {
    subcategory: 'One Day Cooking Worker',
    icon: '/assets/generated/icon-one-day-cooking-worker.dim_128x128.svg',
    label: { en: 'One Day Cooking Worker', regional: 'ஒரு நாள் சமையல் தொழிலாளி' },
  },
  {
    subcategory: 'Function Cooking Team',
    icon: '/assets/generated/icon-function-cooking-team.dim_128x128.svg',
    label: { en: 'Function Cooking Team', regional: 'விழா சமையல் குழு' },
  },
  {
    subcategory: 'Cleaning Worker',
    icon: '/assets/generated/icon-cleaning-worker.dim_128x128.svg',
    label: { en: 'Cleaning Worker', regional: 'சுத்தம் செய்யும் தொழிலாளி' },
  },
  {
    subcategory: 'Tailor',
    icon: '/assets/generated/icon-tailor.dim_128x128.svg',
    label: { en: 'Tailor', regional: 'தையல்காரர்' },
  },
  {
    subcategory: 'Aari Worker',
    icon: '/assets/generated/icon-aari-worker.dim_128x128.svg',
    label: { en: 'Aari Worker', regional: 'ஆரி வேலை செய்பவர்' },
  },
  {
    subcategory: 'Blouse Designer',
    icon: '/assets/generated/icon-blouse-designer.dim_128x128.svg',
    label: { en: 'Blouse Designer', regional: 'ரவிக்கை வடிவமைப்பாளர்' },
  },
  {
    subcategory: 'Saree Falls/Pico Worker',
    icon: '/assets/generated/icon-saree-falls-pico-worker.dim_128x128.svg',
    label: { en: 'Saree Falls/Pico Worker', regional: 'புடவை ஃபால்ஸ்/பிகோ தொழிலாளி' },
  },
  {
    subcategory: 'Ironing Service',
    icon: '/assets/generated/icon-ironing-service.dim_128x128.svg',
    label: { en: 'Ironing Service', regional: 'இஸ்திரி சேவை' },
  },
  {
    subcategory: 'Farm Labour',
    icon: '/assets/generated/icon-farm-labour.dim_128x128.svg',
    label: { en: 'Farm Labour', regional: 'விவசாய தொழிலாளி' },
  },
  {
    subcategory: 'Planting Worker',
    icon: '/assets/generated/icon-planting-worker.dim_128x128.svg',
    label: { en: 'Planting Worker', regional: 'நடவு தொழிலாளி' },
  },
  {
    subcategory: 'Harvest Worker',
    icon: '/assets/generated/icon-harvest-worker.dim_128x128.svg',
    label: { en: 'Harvest Worker', regional: 'அறுவடை தொழிலாளி' },
  },
  {
    subcategory: 'Sprayer Worker',
    icon: '/assets/generated/icon-sprayer-worker.dim_128x128.svg',
    label: { en: 'Sprayer Worker', regional: 'தெளிப்பு தொழிலாளி' },
  },
];

export function getLocalSkilledWorkersSubcategories(): LocalSkilledWorker[] {
  return localSkilledWorkers;
}

export function getAllLocalSkilledWorkersSubcategories(): string[] {
  return localSkilledWorkers.map((worker) => worker.subcategory);
}

export function getLocalSkilledWorkerIcon(subcategory: string): string {
  if (!subcategory) {
    return '/assets/generated/icon-fallback.dim_128x128.svg';
  }

  // Try exact match first
  const exactMatch = localSkilledWorkers.find((w) => w.subcategory === subcategory);
  if (exactMatch) {
    return exactMatch.icon;
  }

  // Try case-insensitive match
  const caseInsensitiveMatch = localSkilledWorkers.find(
    (w) => w.subcategory.toLowerCase() === subcategory.toLowerCase()
  );
  if (caseInsensitiveMatch) {
    return caseInsensitiveMatch.icon;
  }

  // Try normalized match (remove spaces, slashes, hyphens)
  const normalizedInput = normalizeSubcategoryKey(subcategory);
  const normalizedMatch = localSkilledWorkers.find(
    (w) => normalizeSubcategoryKey(w.subcategory) === normalizedInput
  );
  if (normalizedMatch) {
    return normalizedMatch.icon;
  }

  // Return fallback if no match found
  return '/assets/generated/icon-fallback.dim_128x128.svg';
}

export function getLocalSkilledWorkerLabel(subcategory: string): { en: string; regional: string } {
  if (!subcategory) {
    return { en: 'Worker', regional: 'தொழிலாளி' };
  }

  // Try exact match first
  const exactMatch = localSkilledWorkers.find((w) => w.subcategory === subcategory);
  if (exactMatch) {
    return exactMatch.label;
  }

  // Try case-insensitive match
  const caseInsensitiveMatch = localSkilledWorkers.find(
    (w) => w.subcategory.toLowerCase() === subcategory.toLowerCase()
  );
  if (caseInsensitiveMatch) {
    return caseInsensitiveMatch.label;
  }

  // Try normalized match
  const normalizedInput = normalizeSubcategoryKey(subcategory);
  const normalizedMatch = localSkilledWorkers.find(
    (w) => normalizeSubcategoryKey(w.subcategory) === normalizedInput
  );
  if (normalizedMatch) {
    return normalizedMatch.label;
  }

  // Return original subcategory as fallback
  return { en: subcategory, regional: subcategory };
}
