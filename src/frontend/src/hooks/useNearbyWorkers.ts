import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker, Location } from '@/backend';
import { logError } from '@/utils/errors';

interface NearbyWorkersParams {
  location: Location | null;
  limit?: number;
  enabled?: boolean;
}

// Haversine distance calculation (in kilometers)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useNearbyWorkers({
  location,
  limit = 50,
  enabled = true,
}: NearbyWorkersParams) {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['nearby-workers', location?.lat, location?.lon, limit],
    queryFn: async () => {
      if (!actor || !location) return [];

      try {
        const workers = await actor.getWorkersWithDistance(location);

        if (!Array.isArray(workers)) return [];

        // Filter workers with valid locations and calculate distances
        const workersWithDistance = workers
          .filter((w) => w.location && w.location.lat && w.location.lon)
          .map((worker) => ({
            worker,
            distance: calculateDistance(
              location.lat,
              location.lon,
              worker.location!.lat,
              worker.location!.lon
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, limit)
          .map((item) => item.worker);

        return workersWithDistance;
      } catch (error) {
        logError('useNearbyWorkers', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!location && enabled,
    staleTime: 60000, // 1 minute
  });
}
