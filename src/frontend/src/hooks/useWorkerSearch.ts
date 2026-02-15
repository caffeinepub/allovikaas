import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker } from '@/backend';
import { logError } from '@/utils/errors';

/**
 * Validates and sanitizes a worker object to ensure it has all required fields
 */
function sanitizeWorker(worker: any): Worker | null {
  try {
    // Check required fields
    if (!worker || typeof worker !== 'object') return null;
    if (!worker.id || typeof worker.id !== 'bigint') return null;
    if (!worker.name || typeof worker.name !== 'string') return null;
    if (!worker.phone || typeof worker.phone !== 'string') return null;
    if (!worker.category || typeof worker.category !== 'string') return null;
    if (!worker.subcategory || typeof worker.subcategory !== 'string') return null;
    if (!worker.area || typeof worker.area !== 'string') return null;
    if (!worker.experience || typeof worker.experience !== 'string') return null;
    if (!worker.workingHours || typeof worker.workingHours !== 'string') return null;
    if (!worker.photo || typeof worker.photo.getDirectURL !== 'function') return null;
    if (!worker.status || typeof worker.status !== 'object') return null;

    // Worker is valid
    return worker as Worker;
  } catch (error) {
    logError('sanitizeWorker', error);
    return null;
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

        // Sanitize input parameters
        const safeArea = area?.trim() || '';
        const safeCategory = category?.trim() || '';
        const safeSubcategory = subcategory?.trim() || '';

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

        // Sanitize each worker to ensure data integrity
        const sanitizedWorkers = workers
          .map(sanitizeWorker)
          .filter((w): w is Worker => w !== null);

        return sanitizedWorkers;
      } catch (error) {
        logError('useWorkerSearch', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
