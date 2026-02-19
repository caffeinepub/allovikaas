import { Worker } from '@/backend';
import { searchWorkers } from './smartWorkerSearch';

/**
 * Sort workers by relevance to search query using smart priority ranking
 * Falls back to alphabetical by name if scores are equal
 */
export function sortWorkersByRelevance(workers: Worker[], query: string): Worker[] {
  if (!query || !workers || workers.length === 0) {
    return workers;
  }

  // Use smart search to get ranked results
  // Set limit high to get all workers ranked
  return searchWorkers(workers, query, { limit: workers.length, minResults: 0 });
}
