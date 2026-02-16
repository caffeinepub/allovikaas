import { Worker } from '@/backend';

export interface WorkerSubgroup {
  subgroupName: string;
  workers: Worker[];
}

/**
 * Normalize subcategory string for consistent matching
 */
function normalizeSubcategory(subcategory: string | undefined | null): string {
  if (!subcategory) return '';
  return subcategory.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Group workers by subcategory for display
 * Returns array of subgroups with workers
 */
export function groupWorkersBySubcategory(workers: Worker[]): WorkerSubgroup[] {
  if (!workers || workers.length === 0) {
    return [];
  }

  // Group by category (since subcategory is removed)
  const groups = new Map<string, Worker[]>();

  for (const worker of workers) {
    const category = worker.category || 'Other';
    
    if (!groups.has(category)) {
      groups.set(category, []);
    }
    groups.get(category)!.push(worker);
  }

  // Convert to array of subgroups
  const subgroups: WorkerSubgroup[] = [];
  for (const [category, categoryWorkers] of groups.entries()) {
    subgroups.push({
      subgroupName: category,
      workers: categoryWorkers,
    });
  }

  // Sort subgroups by name
  subgroups.sort((a, b) => a.subgroupName.localeCompare(b.subgroupName));

  return subgroups;
}
