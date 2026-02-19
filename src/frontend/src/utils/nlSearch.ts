/**
 * Lightweight natural-language search helper for Tamil and English.
 * Now delegates to smartWorkerSearch for unified ranking.
 */

import { Worker } from '@/backend';
import { searchWorkers } from './smartWorkerSearch';

/**
 * Match and rank workers based on natural language query
 * @deprecated Use searchWorkers from smartWorkerSearch instead
 */
export function matchWorkers<T extends { skills: string[]; category: string; area: string }>(
  workers: T[],
  query: string,
  limit: number = 10
): T[] {
  // Type guard: if workers are Worker type, use searchWorkers directly
  if (workers.length > 0 && 'id' in workers[0] && 'userId' in workers[0]) {
    return searchWorkers(workers as unknown as Worker[], query, { limit }) as unknown as T[];
  }
  
  // For generic types, we need to handle them differently
  // This is a fallback that shouldn't normally be hit in production
  return workers.slice(0, limit);
}

// Re-export for backward compatibility
export { parseQuery } from './smartQueryParser';
export { searchWorkers };
