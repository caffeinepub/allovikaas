import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker } from '@/backend';
import { logError } from '@/utils/errors';

/**
 * Lightweight validation for worker objects from text search
 * Ensures basic structure without dropping workers with missing optional fields
 */
function validateWorker(worker: any): worker is Worker {
  try {
    if (!worker || typeof worker !== 'object') return false;
    if (!worker.id || typeof worker.id !== 'bigint') return false;
    if (!worker.name || typeof worker.name !== 'string') return false;
    if (!worker.status || typeof worker.status !== 'object') return false;
    
    // Must be approved
    if (worker.status.__kind__ !== 'approved') return false;
    
    return true;
  } catch (error) {
    logError('validateWorker', error);
    return false;
  }
}

/**
 * React Query hook for universal worker search
 * Searches across worker name, category, subcategory, area, and skill tags
 * Supports multi-token queries (e.g., "driver madurai")
 */
export function useWorkerTextSearch(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['worker-universal-search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];

      try {
        // Trim and collapse whitespace
        const sanitizedSearch = searchTerm?.trim().replace(/\s+/g, ' ') || '';

        // Return empty array for empty/whitespace queries
        if (!sanitizedSearch) {
          return [];
        }

        // Call backend universal search (matches skills, tags, category, subcategory, area)
        const workers = await actor.universalSearch(sanitizedSearch);

        // Validate response is an array
        if (!Array.isArray(workers)) {
          logError('useWorkerTextSearch', 'Invalid response: not an array');
          return [];
        }

        // Lightweight validation - keep workers with basic structure
        const validWorkers = workers.filter(validateWorker);

        return validWorkers;
      } catch (error) {
        logError('useWorkerTextSearch', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
