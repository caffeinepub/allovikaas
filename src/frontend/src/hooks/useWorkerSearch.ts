import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker } from '@/backend';
import { logError } from '@/utils/errors';

export function useWorkerSearch(area: string, category: string, subcategory: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['worker-search', area, category, subcategory],
    queryFn: async () => {
      if (!actor) return [];

      try {
        // Get public workers (active only)
        const workers = await actor.getPublicWorkers();

        if (!Array.isArray(workers)) {
          logError('useWorkerSearch', 'Invalid response: not an array');
          return [];
        }

        // Filter to active workers only (already done by backend, but double-check)
        let filtered = workers.filter(w => w.status.__kind__ === 'active');

        // Filter by category
        if (category) {
          filtered = filtered.filter(w => 
            w.category?.toLowerCase().includes(category.toLowerCase())
          );
        }

        // Filter by area
        if (area) {
          filtered = filtered.filter(w => 
            w.area?.toLowerCase().includes(area.toLowerCase())
          );
        }

        return filtered;
      } catch (error) {
        logError('useWorkerSearch', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
