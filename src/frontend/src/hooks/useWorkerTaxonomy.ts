import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { CategoryMapping } from '@/backend';
import {
  LOCAL_SKILLED_WORKERS_CATEGORY,
  getAllLocalSkilledWorkersSubcategories,
} from '@/config/localSkilledWorkers';
import { logError } from '@/utils/errors';

// Fallback taxonomy matching the old hardcoded values
const FALLBACK_CATEGORIES = [
  'Construction',
  'Agriculture',
  'Home Services',
  'Transport',
  'Events & Cooking',
  'Daily Helpers',
  'Repairs',
  'Supplies',
  LOCAL_SKILLED_WORKERS_CATEGORY,
];

const FALLBACK_SUBCATEGORIES: Record<string, string[]> = {
  'Construction': ['Mason', 'Carpenter', 'Painter', 'Welder', 'Tiles Worker'],
  'Agriculture': ['Farm Worker', 'Tractor Driver', 'Harvester', 'Irrigation Specialist'],
  'Home Services': ['Electrician', 'Plumber', 'AC Service', 'CCTV Installation', 'Cleaning'],
  'Transport': ['Mini Lorry', 'Load Auto', 'JCB Operator', 'Water Tanker'],
  'Events & Cooking': ['Catering', 'Cook', 'Makeup Artist', 'Mehendi Artist', 'Tent Setup'],
  'Daily Helpers': ['House Help', 'Babysitter', 'Elder Care', 'Driver'],
  'Repairs': ['Mobile Repair', 'Appliance Repair', 'Bike Mechanic', 'Car Mechanic'],
  'Supplies': ['Water Supply', 'Gas Supply', 'Material Supply', 'Equipment Rental'],
  [LOCAL_SKILLED_WORKERS_CATEGORY]: getAllLocalSkilledWorkersSubcategories(),
};

export interface WorkerTaxonomy {
  categories: string[];
  subcategoriesMap: Record<string, string[]>;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Hook to fetch worker taxonomy (categories and subcategories) from the backend.
 * Provides safe fallbacks when data is unavailable, empty, or contains unexpected values.
 * Ensures pages can still render and function even if the backend call fails.
 */
export function useWorkerTaxonomy(): WorkerTaxonomy {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<CategoryMapping[]>({
    queryKey: ['worker-taxonomy'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const taxonomy = await actor.getAllCategories();
        // Validate that we got an array
        if (!Array.isArray(taxonomy)) {
          logError('useWorkerTaxonomy', 'Invalid taxonomy response: not an array');
          return [];
        }
        return taxonomy;
      } catch (error) {
        logError('useWorkerTaxonomy', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  // Build categories list and subcategories map from backend data
  const buildTaxonomy = (data: CategoryMapping[] | undefined): { categories: string[]; subcategoriesMap: Record<string, string[]> } => {
    // Guard against undefined or non-array data
    if (!data || !Array.isArray(data) || data.length === 0) {
      return {
        categories: FALLBACK_CATEGORIES,
        subcategoriesMap: FALLBACK_SUBCATEGORIES,
      };
    }

    const categoriesSet = new Set<string>();
    const subcategoriesMap: Record<string, string[]> = {};

    // Process backend taxonomy with defensive checks
    try {
      data.forEach((mapping) => {
        // Validate mapping structure
        if (!mapping || typeof mapping !== 'object') {
          return;
        }
        
        if (mapping.category && typeof mapping.category === 'string' && mapping.category.trim()) {
          const categoryName = mapping.category.trim();
          categoriesSet.add(categoryName);
          
          // Validate and filter subcategories, removing duplicates
          if (Array.isArray(mapping.subcategories)) {
            const subcatsSet = new Set<string>();
            mapping.subcategories.forEach(sub => {
              if (sub && typeof sub === 'string' && sub.trim()) {
                subcatsSet.add(sub.trim());
              }
            });
            
            // Merge with existing subcategories for this category (in case of duplicates)
            if (subcategoriesMap[categoryName]) {
              const existingSet = new Set(subcategoriesMap[categoryName]);
              subcatsSet.forEach(sub => existingSet.add(sub));
              subcategoriesMap[categoryName] = Array.from(existingSet);
            } else {
              subcategoriesMap[categoryName] = Array.from(subcatsSet);
            }
          } else {
            // Initialize empty array if no subcategories provided
            if (!subcategoriesMap[categoryName]) {
              subcategoriesMap[categoryName] = [];
            }
          }
        }
      });
    } catch (error) {
      logError('buildTaxonomy', error);
      // Return fallback on any processing error
      return {
        categories: FALLBACK_CATEGORIES,
        subcategoriesMap: FALLBACK_SUBCATEGORIES,
      };
    }

    // Always ensure Local Skilled Workers category is present with all subcategories from config
    categoriesSet.add(LOCAL_SKILLED_WORKERS_CATEGORY);
    const localSkilledSubcats = getAllLocalSkilledWorkersSubcategories();
    
    // Merge backend subcategories with config subcategories for Local Skilled Workers
    if (subcategoriesMap[LOCAL_SKILLED_WORKERS_CATEGORY]) {
      const mergedSet = new Set([
        ...subcategoriesMap[LOCAL_SKILLED_WORKERS_CATEGORY],
        ...localSkilledSubcats
      ]);
      subcategoriesMap[LOCAL_SKILLED_WORKERS_CATEGORY] = Array.from(mergedSet);
    } else {
      subcategoriesMap[LOCAL_SKILLED_WORKERS_CATEGORY] = localSkilledSubcats;
    }

    // Convert Set to Array for categories
    const categories = Array.from(categoriesSet);

    // If we got empty results after processing, fall back to hardcoded taxonomy
    if (categories.length === 0) {
      return {
        categories: FALLBACK_CATEGORIES,
        subcategoriesMap: FALLBACK_SUBCATEGORIES,
      };
    }

    // Ensure all categories have a subcategories entry (even if empty)
    categories.forEach(cat => {
      if (!subcategoriesMap[cat]) {
        subcategoriesMap[cat] = [];
      }
    });

    return { categories, subcategoriesMap };
  };

  const { categories, subcategoriesMap } = buildTaxonomy(query.data);

  return {
    categories,
    subcategoriesMap,
    isLoading: actorFetching || query.isLoading,
    isError: query.isError,
  };
}

/**
 * Validates if a category exists in the taxonomy
 */
export function isValidCategory(category: string | undefined, taxonomy: WorkerTaxonomy): boolean {
  if (!category || typeof category !== 'string') return false;
  return taxonomy.categories.includes(category);
}

/**
 * Validates if a subcategory exists under a given category
 */
export function isValidSubcategory(category: string | undefined, subcategory: string | undefined, taxonomy: WorkerTaxonomy): boolean {
  if (!category || !subcategory || typeof category !== 'string' || typeof subcategory !== 'string') return false;
  const subcategories = taxonomy.subcategoriesMap[category] || [];
  return subcategories.includes(subcategory);
}

/**
 * Gets subcategories for a category with safe fallback
 */
export function getSubcategoriesForCategory(category: string | undefined, taxonomy: WorkerTaxonomy): string[] {
  if (!category || typeof category !== 'string') return [];
  return taxonomy.subcategoriesMap[category] || [];
}
