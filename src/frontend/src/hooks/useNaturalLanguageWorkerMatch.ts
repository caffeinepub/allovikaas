import { useMemo } from 'react';
import { useGetPublicWorkers } from './useQueries';
import { matchWorkers } from '@/utils/nlSearch';
import { Worker } from '@/backend';

/**
 * Hook that uses public workers data and nlSearch utilities to compute
 * a ranked, limited list of matching workers for a given query.
 * Does not require authentication and does not mutate URL params.
 * Now uses fuzzy matching for typo tolerance.
 */
export function useNaturalLanguageWorkerMatch(query: string, limit: number = 8) {
  const { data: workers = [], isLoading, error } = useGetPublicWorkers();

  const matches = useMemo(() => {
    if (!query.trim() || workers.length === 0) {
      return [];
    }

    return matchWorkers(workers, query, limit);
  }, [workers, query, limit]);

  return {
    matches,
    isLoading,
    error,
    hasMatches: matches.length > 0,
  };
}
