import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker } from '@/backend';

interface UseNearbyWorkersOptions {
  location: { lat: number; lon: number } | null;
  limit?: number;
}

export function useNearbyWorkers({ location, limit = 20 }: UseNearbyWorkersOptions) {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['nearby-workers', location?.lat, location?.lon, limit],
    queryFn: async () => {
      // Backend doesn't have location-based search, return empty array
      return [];
    },
    enabled: !!actor && !isFetching && !!location,
  });
}
