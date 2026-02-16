import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker } from '@/backend';
import { logError } from '@/utils/errors';
import { workerMatchesFuzzyQuery } from '@/utils/fuzzyWorkerSearch';

export function useWorkerTextSearch(searchTerm: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['worker-universal-search', searchTerm],
    queryFn: async () => {
      if (!actor) return [];

      try {
        const sanitizedSearch = searchTerm?.trim().replace(/\s+/g, ' ') || '';

        if (!sanitizedSearch) {
          return [];
        }

        // Get public workers (active only)
        const workers = await actor.getPublicWorkers();

        if (!Array.isArray(workers)) {
          logError('useWorkerTextSearch', 'Invalid response: not an array');
          return [];
        }

        // Filter to active workers and search across fields with fuzzy matching
        const filtered = workers.filter(w => {
          if (w.status.__kind__ !== 'active') return false;
          
          return workerMatchesFuzzyQuery(
            {
              name: w.name,
              area: w.area,
              category: w.category,
              skills: w.skills,
            },
            sanitizedSearch,
            0.75 // 75% similarity threshold
          );
        });

        return filtered;
      } catch (error) {
        logError('useWorkerTextSearch', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
