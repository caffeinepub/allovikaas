import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Suggestion } from '@/backend';
import { logError } from '@/utils/errors';

/**
 * Hook for fetching live search suggestions from the backend
 * Includes input sanitization and safe error handling
 */
export function useLiveSearchSuggestions(prefix: string, enabled: boolean = true) {
  const { actor, isFetching: actorFetching } = useActor();

  // Sanitize input: trim and collapse multiple spaces
  const sanitizedPrefix = prefix
    .trim()
    .replace(/\s+/g, ' ');

  return useQuery<Suggestion[]>({
    queryKey: ['live-suggestions', sanitizedPrefix],
    queryFn: async () => {
      if (!actor) return [];
      
      try {
        const suggestions = await actor.getLiveSearchSuggestions(sanitizedPrefix);
        
        // Client-side deduplication for robust rendering
        const seen = new Set<string>();
        const dedupedSuggestions: Suggestion[] = [];
        
        for (const suggestion of suggestions) {
          const normalizedText = suggestion.text.trim().toLowerCase();
          if (normalizedText && !seen.has(normalizedText)) {
            seen.add(normalizedText);
            dedupedSuggestions.push(suggestion);
          }
        }
        
        return dedupedSuggestions;
      } catch (error) {
        logError('useLiveSearchSuggestions', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching && enabled && sanitizedPrefix.length >= 1,
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 60000, // Keep in cache for 1 minute
  });
}
