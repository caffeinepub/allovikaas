import { useI18n } from '@/components/i18n/I18nProvider';
import { LOCAL_SKILLED_WORKERS_GROUPS } from '@/config/localSkilledWorkers';

// Map English subcategory labels to i18n keys
const subcategoryToI18nKey: Record<string, string> = {
  'Mason': 'lsw.sub.mason',
  'Coolie Helper': 'lsw.sub.coolieHelper',
  'Centring Worker': 'lsw.sub.centringWorker',
  'Bar Bending Worker': 'lsw.sub.barBendingWorker',
  'Door Maker': 'lsw.sub.doorMaker',
  'Door Maker (Kathavu seibavar)': 'lsw.sub.doorMaker',
  'Window Maker': 'lsw.sub.windowMaker',
  'Window Maker (Jannal seibavar)': 'lsw.sub.windowMaker',
  'Carpenter': 'lsw.sub.carpenter',
  'Grill / Gate Fabricator': 'lsw.sub.grillGateFabricator',
  'Welder': 'lsw.sub.welder',
  'Tree Cutter': 'lsw.sub.treeCutter',
  'Tree Cutter (Maram aruppavar)': 'lsw.sub.treeCutter',
  'Coconut Tree Climber': 'lsw.sub.coconutTreeClimber',
  'Coconut Tree Climber (Thennai maram yeripavar)': 'lsw.sub.coconutTreeClimber',
  'Coconut Picker': 'lsw.sub.coconutPicker',
  'Firewood Cutter': 'lsw.sub.firewoodCutter',
  'Basket Maker': 'lsw.sub.basketMaker',
  'Basket Maker (Koodai pinnubavar)': 'lsw.sub.basketMaker',
  'Rope Maker': 'lsw.sub.ropeMaker',
  'Mat Weaver': 'lsw.sub.matWeaver',
  'Pot Maker': 'lsw.sub.potMaker',
  'House Maid': 'lsw.sub.houseMaid',
  'One Day Cooking Worker': 'lsw.sub.oneDayCookingWorker',
  'One Day Cooking Worker (Orunaal samayal)': 'lsw.sub.oneDayCookingWorker',
  'Function Cooking Team': 'lsw.sub.functionCookingTeam',
  'Cleaning Worker': 'lsw.sub.cleaningWorker',
  'Tailor': 'lsw.sub.tailor',
  'Aari Worker': 'lsw.sub.aariWorker',
  'Blouse Designer': 'lsw.sub.blouseDesigner',
  'Saree Falls/Pico Worker': 'lsw.sub.sareeFallsPicoWorker',
  'Ironing Service': 'lsw.sub.ironingService',
  'Farm Labour': 'lsw.sub.farmLabour',
  'Planting Worker': 'lsw.sub.plantingWorker',
  'Harvest Worker': 'lsw.sub.harvestWorker',
  'Sprayer Worker': 'lsw.sub.sprayerWorker',
};

// Map English group names to i18n keys
const groupToI18nKey: Record<string, string> = {
  'Construction Related': 'lsw.group.constructionRelated',
  'Wood & Metal': 'lsw.group.woodMetal',
  'Tree & Land Works': 'lsw.group.treeLandWorks',
  'Handcraft & Small Work': 'lsw.group.handcraftSmallWork',
  'Home & Daily Help': 'lsw.group.homeDailyHelp',
  'Clothing & Tailoring': 'lsw.group.clothingTailoring',
  'Agriculture Workers': 'lsw.group.agricultureWorkers',
};

/**
 * Get bilingual label for a Local Skilled Workers group name
 */
export function getBilingualGroupLabel(groupName: string, t: ReturnType<typeof useI18n>['t']): { en: string; regional: string } {
  const i18nKey = groupToI18nKey[groupName];
  if (i18nKey) {
    return t(i18nKey);
  }
  // Fallback to the group name itself
  return { en: groupName, regional: groupName };
}

/**
 * Get bilingual label for a subcategory
 * Strips any parenthetical transliterations and returns clean bilingual labels
 */
export function getBilingualSubcategoryLabel(subcategoryLabel: string, t: ReturnType<typeof useI18n>['t']): { en: string; regional: string } {
  // Strip parenthetical transliterations for lookup
  const cleanLabel = subcategoryLabel.replace(/\s*\([^)]*\)\s*/g, '').trim();
  
  const i18nKey = subcategoryToI18nKey[cleanLabel] || subcategoryToI18nKey[subcategoryLabel];
  if (i18nKey) {
    return t(i18nKey);
  }
  
  // Fallback: return the clean label
  return { en: cleanLabel, regional: cleanLabel };
}

/**
 * Get bilingual label for any category (including Local Skilled Workers)
 */
export function getBilingualCategoryLabel(categoryName: string, t: ReturnType<typeof useI18n>['t']): { en: string; regional: string } {
  if (categoryName === 'Local Skilled Workers') {
    return t('category.localSkilledWorkers');
  }
  
  // Map other categories
  const categoryKeyMap: Record<string, string> = {
    'Construction': 'category.construction',
    'Agriculture': 'category.agriculture',
    'Home Services': 'category.homeservices',
    'Transport': 'category.transport',
    'Events & Cooking': 'category.events',
    'Daily Helpers': 'category.helpers',
    'Repairs': 'category.repairs',
    'Supplies': 'category.supplies',
  };
  
  const i18nKey = categoryKeyMap[categoryName];
  if (i18nKey) {
    return t(i18nKey);
  }
  
  return { en: categoryName, regional: categoryName };
}

/**
 * Get the canonical English value for a subcategory (strips transliterations)
 * This is what should be sent to the backend
 */
export function getCanonicalSubcategoryValue(subcategoryLabel: string): string {
  return subcategoryLabel.replace(/\s*\([^)]*\)\s*/g, '').trim();
}
