import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker } from '@/backend';

export function useWorkerSearch(area: string, category: string, subcategory: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['worker-search', area, category, subcategory],
    queryFn: async () => {
      if (!actor) return [];

      try {
        let workers: Worker[] = [];

        // Priority: subcategory > category > area
        if (subcategory) {
          if (area) {
            // Area + Subcategory
            workers = await actor.searchWorkersByAreaAndSubcategory(area, subcategory);
          } else {
            // Subcategory only
            workers = await actor.getWorkersBySubcategory(subcategory);
          }
        } else if (category) {
          if (area) {
            // Area + Category
            workers = await actor.searchWorkersByAreaAndCategory(area, category);
          } else {
            // Category only
            workers = await actor.getWorkersByCategory(category);
          }
        } else if (area) {
          // Area only
          workers = await actor.searchWorkersByArea(area);
        } else {
          // No filters - return empty
          workers = [];
        }

        return workers;
      } catch (error) {
        console.error('Error searching workers:', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}
