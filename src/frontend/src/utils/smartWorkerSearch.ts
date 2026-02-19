/**
 * Unified worker scoring and ranking with priority:
 * 1. Location match
 * 2. Skills/tags match (OR logic, multiple skills = higher score)
 * 3. Category match
 * 4. Fuzzy similarity (low priority)
 */

import { Worker } from '@/backend';
import { parseQuery, ParsedQuery } from './smartQueryParser';
import { isFuzzyMatch, normalizeForSearch } from './fuzzyWorkerSearch';

interface ScoredWorker {
  worker: Worker;
  score: number;
  matchDetails: {
    locationMatch: boolean;
    skillMatches: number;
    categoryMatch: boolean;
    fuzzyMatch: boolean;
  };
}

/**
 * Score a worker based on parsed query with priority ranking
 */
function scoreWorker(worker: Worker, parsed: ParsedQuery): ScoredWorker {
  let score = 0;
  const matchDetails = {
    locationMatch: false,
    skillMatches: 0,
    categoryMatch: false,
    fuzzyMatch: false,
  };
  
  // Priority 1: Location match (highest priority)
  if (parsed.locations.length > 0) {
    const workerArea = normalizeForSearch(worker.area);
    for (const location of parsed.locations) {
      if (isFuzzyMatch(location, workerArea, 0.75)) {
        score += 1000;
        matchDetails.locationMatch = true;
        break;
      }
    }
  }
  
  // Priority 2: Skills/tags match (OR logic, count multiple matches)
  if (parsed.skills.length > 0) {
    const workerSkills = worker.skills.map(s => normalizeForSearch(s));
    const workerCategory = normalizeForSearch(worker.category);
    
    for (const skill of parsed.skills) {
      // Check skills array
      const skillMatch = workerSkills.some(ws => isFuzzyMatch(skill, ws, 0.75));
      if (skillMatch) {
        score += 100;
        matchDetails.skillMatches++;
      }
      
      // Also check category for skill match
      if (isFuzzyMatch(skill, workerCategory, 0.75)) {
        score += 80;
        matchDetails.skillMatches++;
      }
    }
  }
  
  // Priority 3: Category match
  if (parsed.categories.length > 0) {
    const workerCategory = normalizeForSearch(worker.category);
    for (const category of parsed.categories) {
      if (isFuzzyMatch(category, workerCategory, 0.75)) {
        score += 50;
        matchDetails.categoryMatch = true;
        break;
      }
    }
  }
  
  // Priority 4: Fuzzy similarity (low priority, tie-breaker)
  if (score === 0 && parsed.canonicalTokens.length > 0) {
    const workerName = normalizeForSearch(worker.name);
    const workerArea = normalizeForSearch(worker.area);
    const workerCategory = normalizeForSearch(worker.category);
    const workerSkills = worker.skills.map(s => normalizeForSearch(s));
    
    for (const token of parsed.canonicalTokens) {
      if (isFuzzyMatch(token, workerName, 0.75)) {
        score += 5;
        matchDetails.fuzzyMatch = true;
      }
      if (isFuzzyMatch(token, workerArea, 0.75)) {
        score += 3;
        matchDetails.fuzzyMatch = true;
      }
      if (isFuzzyMatch(token, workerCategory, 0.75)) {
        score += 2;
        matchDetails.fuzzyMatch = true;
      }
      if (workerSkills.some(ws => isFuzzyMatch(token, ws, 0.75))) {
        score += 2;
        matchDetails.fuzzyMatch = true;
      }
    }
  }
  
  return {
    worker,
    score,
    matchDetails,
  };
}

/**
 * Search and rank workers with non-empty fallback
 */
export function searchWorkers(
  workers: Worker[],
  query: string,
  options: {
    limit?: number;
    minResults?: number;
  } = {}
): Worker[] {
  const { limit = 10, minResults = 3 } = options;
  
  if (!query.trim() || workers.length === 0) {
    return [];
  }
  
  const parsed = parseQuery(query);
  
  // Score all workers
  const scored = workers.map(worker => scoreWorker(worker, parsed));
  
  // Sort by score (descending)
  scored.sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    // Tie-breaker: alphabetical by name
    return a.worker.name.localeCompare(b.worker.name);
  });
  
  // Get strong matches (score > 0)
  const strongMatches = scored.filter(s => s.score > 0);
  
  // If we have enough strong matches, return them
  if (strongMatches.length >= minResults) {
    return strongMatches.slice(0, limit).map(s => s.worker);
  }
  
  // Non-empty fallback: show related workers (at least minResults when possible)
  const fallbackCount = Math.min(minResults, workers.length);
  
  // If we have some matches but not enough, pad with highest-scored workers
  if (strongMatches.length > 0) {
    const needed = Math.min(fallbackCount - strongMatches.length, workers.length - strongMatches.length);
    const additional = scored
      .filter(s => s.score === 0)
      .slice(0, needed);
    
    return [...strongMatches, ...additional].slice(0, limit).map(s => s.worker);
  }
  
  // No matches at all: return top workers by any criteria (related workers)
  return scored.slice(0, Math.min(fallbackCount, limit)).map(s => s.worker);
}
