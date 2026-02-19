import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker } from '@/backend';
import { logError } from '@/utils/errors';
import { normalizeIntentQuery } from '@/utils/intentQueryNormalization';
import { searchWorkers } from '@/utils/smartWorkerSearch';

/**
 * React Query hook for intent-based worker search.
 * Uses backend intent search API when available, with client-side fallback.
 */
export function useIntentWorkerSearch(query: string, options: { limit?: number; minResults?: number } = {}) {
  const { actor, isFetching } = useActor();
  const { limit = 100, minResults = 3 } = options;

  return useQuery<Worker[]>({
    queryKey: ['intent-worker-search', query, limit, minResults],
    queryFn: async () => {
      if (!actor) return [];

      try {
        // Normalize query before processing
        const normalizedQuery = normalizeIntentQuery(query);
        
        if (!normalizedQuery) {
          return [];
        }

        // Check if backend has intent search capability
        // @ts-ignore - Backend may not have this method yet
        if (typeof actor.searchWorkersByIntent === 'function') {
          try {
            // @ts-ignore
            const results = await actor.searchWorkersByIntent(normalizedQuery);
            
            if (Array.isArray(results)) {
              // Backend handles ranking and fallback
              return results.slice(0, limit);
            }
          } catch (backendError) {
            logError('useIntentWorkerSearch:backend', backendError);
            // Fall through to client-side search
          }
        }

        // Fallback: Use client-side smart search
        const allWorkers = await actor.getPublicWorkers();
        
        if (!Array.isArray(allWorkers)) {
          logError('useIntentWorkerSearch:fallback', 'Invalid workers response');
          return [];
        }

        // Filter to active workers only
        const activeWorkers = allWorkers.filter(w => w.status.__kind__ === 'active');

        // Use client-side smart search with non-empty fallback
        return searchWorkers(activeWorkers, normalizedQuery, { limit, minResults });
      } catch (error) {
        logError('useIntentWorkerSearch', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!query.trim(),
    staleTime: 30000, // 30 seconds
  });
}
