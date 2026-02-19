import { useMemo } from 'react';
import { useGetPublicWorkers } from './useQueries';
import { searchWorkers } from '@/utils/smartWorkerSearch';

/**
 * Hook that uses public workers data and smart search utilities to compute
 * a ranked, limited list of matching workers for a given query.
 * Does not require authentication and does not mutate URL params.
 * Uses smart sentence parsing with spelling correction and priority ranking.
 */
export function useNaturalLanguageWorkerMatch(query: string, limit: number = 8) {
  const { data: workers = [], isLoading, error } = useGetPublicWorkers();

  const matches = useMemo(() => {
    if (!query.trim() || workers.length === 0) {
      return [];
    }

    return searchWorkers(workers, query, { limit, minResults: 0 });
  }, [workers, query, limit]);

  return {
    matches,
    isLoading,
    error,
    hasMatches: matches.length > 0,
  };
}
