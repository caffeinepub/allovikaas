import { Worker } from '@/backend';

/**
 * Relevance sorting utility for workers
 * Priority: tag match > area match > recent activity
 */

interface SortOptions {
  searchQuery?: string;
  areaQuery?: string;
}

/**
 * Normalize text for comparison (lowercase, trim, collapse whitespace)
 */
function normalizeText(text: string | undefined | null): string {
  if (!text || typeof text !== 'string') return '';
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Check if worker's tags/skills match the search query
 */
function hasTagMatch(worker: Worker, query: string): boolean {
  if (!query) return false;
  
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return false;
  
  // Check skills array
  if (Array.isArray(worker.skills)) {
    for (const skill of worker.skills) {
      if (normalizeText(skill).includes(normalizedQuery)) {
        return true;
      }
    }
  }
  
  // Check category and subcategory
  if (normalizeText(worker.category).includes(normalizedQuery)) {
    return true;
  }
  
  if (normalizeText(worker.subcategory).includes(normalizedQuery)) {
    return true;
  }
  
  return false;
}

/**
 * Check if worker's area matches the area query
 */
function hasAreaMatch(worker: Worker, areaQuery: string): boolean {
  if (!areaQuery) return false;
  
  const normalizedArea = normalizeText(worker.area);
  const normalizedQuery = normalizeText(areaQuery);
  
  if (!normalizedArea || !normalizedQuery) return false;
  
  return normalizedArea.includes(normalizedQuery);
}

/**
 * Get recency score (higher = more recent)
 */
function getRecencyScore(worker: Worker): number {
  if (!worker.lastActive) return 0;
  
  try {
    // lastActive is a bigint timestamp in nanoseconds
    const timestamp = Number(worker.lastActive) / 1_000_000; // Convert to milliseconds
    return timestamp;
  } catch {
    return 0;
  }
}

/**
 * Compute relevance score for a worker
 * Returns: [tagMatchScore, areaMatchScore, recencyScore]
 */
function computeRelevanceScore(worker: Worker, options: SortOptions): [number, number, number] {
  const tagMatch = hasTagMatch(worker, options.searchQuery || '') ? 1 : 0;
  const areaMatch = hasAreaMatch(worker, options.areaQuery || '') ? 1 : 0;
  const recency = getRecencyScore(worker);
  
  return [tagMatch, areaMatch, recency];
}

/**
 * Compare two workers by relevance
 * Priority: tag match > area match > recent activity
 */
function compareWorkers(a: Worker, b: Worker, options: SortOptions): number {
  const [aTag, aArea, aRecency] = computeRelevanceScore(a, options);
  const [bTag, bArea, bRecency] = computeRelevanceScore(b, options);
  
  // Compare tag match first
  if (aTag !== bTag) {
    return bTag - aTag; // Higher tag match first
  }
  
  // Then area match
  if (aArea !== bArea) {
    return bArea - aArea; // Higher area match first
  }
  
  // Finally recency
  return bRecency - aRecency; // More recent first
}

/**
 * Sort workers by relevance
 */
export function sortWorkersByRelevance(workers: Worker[], options: SortOptions = {}): Worker[] {
  if (!workers || workers.length === 0) return [];
  
  // Create a shallow copy to avoid mutating the original array
  const sorted = [...workers];
  
  sorted.sort((a, b) => compareWorkers(a, b, options));
  
  return sorted;
}
