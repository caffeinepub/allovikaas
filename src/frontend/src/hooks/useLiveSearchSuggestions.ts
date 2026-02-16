import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useLiveSearchSuggestions(prefix: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['live-suggestions', prefix],
    queryFn: async () => {
      // Backend doesn't have suggestions API, return empty array
      return [];
    },
    enabled: !!actor && !isFetching && prefix.length >= 2,
    staleTime: 30000,
  });
}
