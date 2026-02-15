// Local Skilled Workers Category Configuration
// Single source of truth for the Local Skilled Workers taxonomy

export interface SubcategoryItem {
  label: string;
  icon: string;
}

export interface CategoryGroup {
  groupName: string;
  subcategories: SubcategoryItem[];
}

export const LOCAL_SKILLED_WORKERS_CATEGORY = 'Local Skilled Workers';

export const LOCAL_SKILLED_WORKERS_GROUPS: CategoryGroup[] = [
  {
    groupName: 'Construction Related',
    subcategories: [
      { label: 'Mason', icon: '/assets/generated/icon-mason.dim_128x128.svg' },
      { label: 'Coolie Helper', icon: '/assets/generated/icon-coolie-helper.dim_128x128.svg' },
      { label: 'Centring Worker', icon: '/assets/generated/icon-centring-worker.dim_128x128.svg' },
      { label: 'Bar Bending Worker', icon: '/assets/generated/icon-bar-bending-worker.dim_128x128.svg' },
    ],
  },
  {
    groupName: 'Wood & Metal',
    subcategories: [
      { label: 'Door Maker', icon: '/assets/generated/icon-door-maker.dim_128x128.svg' },
      { label: 'Window Maker', icon: '/assets/generated/icon-window-maker.dim_128x128.svg' },
      { label: 'Carpenter', icon: '/assets/generated/icon-carpenter.dim_128x128.svg' },
      { label: 'Grill / Gate Fabricator', icon: '/assets/generated/icon-grill-gate-fabricator.dim_128x128.svg' },
      { label: 'Welder', icon: '/assets/generated/icon-welder.dim_128x128.svg' },
    ],
  },
  {
    groupName: 'Tree & Land Works',
    subcategories: [
      { label: 'Tree Cutter', icon: '/assets/generated/icon-tree-cutter.dim_128x128.svg' },
      { label: 'Coconut Tree Climber', icon: '/assets/generated/icon-coconut-tree-climber.dim_128x128.svg' },
      { label: 'Coconut Picker', icon: '/assets/generated/icon-coconut-picker.dim_128x128.svg' },
      { label: 'Firewood Cutter', icon: '/assets/generated/icon-firewood-cutter.dim_128x128.svg' },
    ],
  },
  {
    groupName: 'Handcraft & Small Work',
    subcategories: [
      { label: 'Basket Maker', icon: '/assets/generated/icon-basket-maker.dim_128x128.svg' },
      { label: 'Rope Maker', icon: '/assets/generated/icon-rope-maker.dim_128x128.svg' },
      { label: 'Mat Weaver', icon: '/assets/generated/icon-mat-weaver.dim_128x128.svg' },
      { label: 'Pot Maker', icon: '/assets/generated/icon-pot-maker.dim_128x128.svg' },
    ],
  },
  {
    groupName: 'Home & Daily Help',
    subcategories: [
      { label: 'House Maid', icon: '/assets/generated/icon-house-maid.dim_128x128.svg' },
      { label: 'One Day Cooking Worker', icon: '/assets/generated/icon-one-day-cooking-worker.dim_128x128.svg' },
      { label: 'Function Cooking Team', icon: '/assets/generated/icon-function-cooking-team.dim_128x128.svg' },
      { label: 'Cleaning Worker', icon: '/assets/generated/icon-cleaning-worker.dim_128x128.svg' },
    ],
  },
  {
    groupName: 'Clothing & Tailoring',
    subcategories: [
      { label: 'Tailor', icon: '/assets/generated/icon-tailor.dim_128x128.svg' },
      { label: 'Aari Worker', icon: '/assets/generated/icon-aari-worker.dim_128x128.svg' },
      { label: 'Blouse Designer', icon: '/assets/generated/icon-blouse-designer.dim_128x128.svg' },
      { label: 'Saree Falls/Pico Worker', icon: '/assets/generated/icon-saree-falls-pico-worker.dim_128x128.svg' },
      { label: 'Ironing Service', icon: '/assets/generated/icon-ironing-service.dim_128x128.svg' },
    ],
  },
  {
    groupName: 'Agriculture Workers',
    subcategories: [
      { label: 'Farm Labour', icon: '/assets/generated/icon-farm-labour.dim_128x128.svg' },
      { label: 'Planting Worker', icon: '/assets/generated/icon-planting-worker.dim_128x128.svg' },
      { label: 'Harvest Worker', icon: '/assets/generated/icon-harvest-worker.dim_128x128.svg' },
      { label: 'Sprayer Worker', icon: '/assets/generated/icon-sprayer-worker.dim_128x128.svg' },
    ],
  },
];

// Flatten all subcategories for easy access
export const getAllLocalSkilledWorkersSubcategories = (): string[] => {
  try {
    return LOCAL_SKILLED_WORKERS_GROUPS.flatMap((group) =>
      (group.subcategories || []).map((sub) => sub?.label || '').filter(Boolean)
    );
  } catch (error) {
    console.error('Error getting subcategories:', error);
    return [];
  }
};

// Get icon for a specific subcategory with safe fallback
export const getSubcategoryIcon = (subcategoryLabel: string): string => {
  try {
    if (!subcategoryLabel) {
      return '/assets/generated/icon-fallback.dim_128x128.svg';
    }
    
    for (const group of LOCAL_SKILLED_WORKERS_GROUPS) {
      if (!group.subcategories) continue;
      const found = group.subcategories.find((sub) => sub?.label === subcategoryLabel);
      if (found?.icon) return found.icon;
    }
  } catch (error) {
    console.error('Error getting subcategory icon:', error);
  }
  
  // Default fallback icon
  return '/assets/generated/icon-fallback.dim_128x128.svg';
};

// Get subcategory label safely
export const getSubcategoryLabel = (subcategoryLabel: string): string => {
  try {
    if (!subcategoryLabel) return 'Worker';
    return subcategoryLabel;
  } catch (error) {
    console.error('Error getting subcategory label:', error);
    return 'Worker';
  }
};
