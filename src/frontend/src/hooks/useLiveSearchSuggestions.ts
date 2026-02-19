import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { logError } from '@/utils/errors';
import { normalizeSuggestionPrefix } from '@/utils/intentQueryNormalization';

const MIN_SUGGESTION_LENGTH = 2;

/**
 * Hook for live search suggestions powered by backend.
 * Returns suggestion strings for a given prefix.
 */
export function useLiveSearchSuggestions(prefix: string) {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['live-suggestions', prefix],
    queryFn: async () => {
      if (!actor) return [];

      try {
        // Normalize prefix
        const normalizedPrefix = normalizeSuggestionPrefix(prefix);

        // Enforce minimum length
        if (normalizedPrefix.length < MIN_SUGGESTION_LENGTH) {
          return [];
        }

        // Check if backend has suggestions capability
        // @ts-ignore - Backend may not have this method yet
        if (typeof actor.getSearchSuggestions === 'function') {
          try {
            // @ts-ignore
            const suggestions = await actor.getSearchSuggestions(normalizedPrefix);
            
            if (Array.isArray(suggestions)) {
              return suggestions.filter(s => typeof s === 'string' && s.length > 0);
            }
          } catch (backendError) {
            logError('useLiveSearchSuggestions:backend', backendError);
            // Fall through to empty array
          }
        }

        // No backend support yet - return empty array
        return [];
      } catch (error) {
        logError('useLiveSearchSuggestions', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching && prefix.trim().length >= MIN_SUGGESTION_LENGTH,
    staleTime: 60000, // 1 minute
  });
}
