import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker } from '@/backend';
import { logError } from '@/utils/errors';

/**
 * Validates and sanitizes a worker object to ensure it has required fields
 * Relaxed validation - allows optional fields (skills, location, photo URL) to be missing
 */
function sanitizeWorker(worker: any): Worker | null {
  try {
    // Check required fields only
    if (!worker || typeof worker !== 'object') return null;
    if (!worker.id || typeof worker.id !== 'bigint') return null;
    if (!worker.name || typeof worker.name !== 'string') return null;
    if (!worker.category || typeof worker.category !== 'string') return null;
    if (!worker.area || typeof worker.area !== 'string') return null;
    if (!worker.status || typeof worker.status !== 'object') return null;

    // Optional fields are allowed to be missing or invalid
    // phone, subcategory, experience, workingHours, photo, skills, location, etc.
    
    // Worker is valid
    return worker as Worker;
  } catch (error) {
    logError('sanitizeWorker', error);
    return null;
  }
}

/**
 * Checks if a worker is approved for public display
 */
function isWorkerApproved(worker: Worker): boolean {
  try {
    return worker.status.__kind__ === 'approved';
  } catch (error) {
    logError('isWorkerApproved', error);
    return false;
  }
}

export function useWorkerSearch(area: string, category: string, subcategory: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['worker-search', area, category, subcategory],
    queryFn: async () => {
      if (!actor) return [];

      try {
        let workers: Worker[] = [];

        // Normalize and sanitize input parameters (trim + collapse whitespace)
        const safeArea = area?.trim().replace(/\s+/g, ' ') || '';
        const safeCategory = category?.trim().replace(/\s+/g, ' ') || '';
        const safeSubcategory = subcategory?.trim().replace(/\s+/g, ' ') || '';

        // Priority: subcategory > category > area
        if (safeSubcategory) {
          if (safeArea) {
            // Area + Subcategory
            workers = await actor.searchWorkersByAreaAndSubcategory(safeArea, safeSubcategory);
          } else {
            // Subcategory only
            workers = await actor.getWorkersBySubcategory(safeSubcategory);
          }
        } else if (safeCategory) {
          if (safeArea) {
            // Area + Category
            workers = await actor.searchWorkersByAreaAndCategory(safeArea, safeCategory);
          } else {
            // Category only
            workers = await actor.getWorkersByCategory(safeCategory);
          }
        } else if (safeArea) {
          // Area only
          workers = await actor.searchWorkersByArea(safeArea);
        } else {
          // No filters - return empty
          return [];
        }

        // Validate response is an array
        if (!Array.isArray(workers)) {
          logError('useWorkerSearch', 'Invalid response: not an array');
          return [];
        }

        // Sanitize each worker and filter to approved only
        const sanitizedWorkers = workers
          .map(sanitizeWorker)
          .filter((w): w is Worker => w !== null)
          .filter(isWorkerApproved);

        return sanitizedWorkers;
      } catch (error) {
        logError('useWorkerSearch', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
