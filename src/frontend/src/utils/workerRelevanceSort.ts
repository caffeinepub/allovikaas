import { Worker } from '@/backend';
import { normalizeForSearch, calculateFuzzyRelevanceScore } from './fuzzyWorkerSearch';

/**
 * Sort workers by relevance to search query using fuzzy matching
 * Falls back to alphabetical by name if scores are equal
 */
export function sortWorkersByRelevance(workers: Worker[], query: string): Worker[] {
  if (!query || !workers || workers.length === 0) {
    return workers;
  }

  return [...workers].sort((a, b) => {
    const scoreA = calculateFuzzyRelevanceScore(
      {
        name: a.name,
        area: a.area,
        category: a.category,
        skills: a.skills,
      },
      query,
      0.75
    );
    const scoreB = calculateFuzzyRelevanceScore(
      {
        name: b.name,
        area: b.area,
        category: b.category,
        skills: b.skills,
      },
      query,
      0.75
    );

    if (scoreA !== scoreB) {
      return scoreB - scoreA; // Higher score first
    }

    // Fallback to alphabetical by name
    const normalizedNameA = normalizeForSearch(a.name);
    const normalizedNameB = normalizeForSearch(b.name);
    return normalizedNameA.localeCompare(normalizedNameB);
  });
}
