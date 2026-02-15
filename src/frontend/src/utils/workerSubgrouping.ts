import { Worker } from '@/backend';

export interface WorkerSubgroup {
  id: string;
  i18nKey: string;
  workers: Worker[];
}

// Normalize subcategory for matching (trim, lowercase, collapse whitespace)
function normalizeSubcategory(subcategory: string | undefined | null): string {
  if (!subcategory) return '';
  return subcategory.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Construction subgroup mapping
const CONSTRUCTION_GROUPS = [
  {
    id: 'masonry',
    i18nKey: 'subgroup.construction.masonry',
    subcategories: ['mason', 'bricklayer', 'plasterer', 'tiler'],
  },
  {
    id: 'wood',
    i18nKey: 'subgroup.construction.wood',
    subcategories: ['carpenter', 'door maker', 'window maker'],
  },
  {
    id: 'metal',
    i18nKey: 'subgroup.construction.metal',
    subcategories: ['welder', 'grill/gate fabricator', 'bar bending worker'],
  },
  {
    id: 'painting',
    i18nKey: 'subgroup.construction.painting',
    subcategories: ['painter', 'painting work'],
  },
];

// Tailoring subgroup mapping
const TAILORING_GROUPS = [
  {
    id: 'blouse',
    i18nKey: 'subgroup.tailoring.blouse',
    subcategories: ['blouse stitching', 'blouse designer', 'blouse'],
  },
  {
    id: 'saree',
    i18nKey: 'subgroup.tailoring.saree',
    subcategories: ['saree work', 'saree'],
  },
  {
    id: 'aari',
    i18nKey: 'subgroup.tailoring.aari',
    subcategories: ['aari worker', 'aari work', 'aari'],
  },
  {
    id: 'alteration',
    i18nKey: 'subgroup.tailoring.alteration',
    subcategories: ['saree falls/pico', 'saree falls/pico worker', 'alteration', 'ironing service'],
  },
];

function getSubgroupForWorker(
  worker: Worker,
  groups: Array<{ id: string; i18nKey: string; subcategories: string[] }>
): string | null {
  const normalizedSubcat = normalizeSubcategory(worker.subcategory);
  if (!normalizedSubcat) return null;

  for (const group of groups) {
    if (group.subcategories.some((sub) => normalizeSubcategory(sub) === normalizedSubcat)) {
      return group.id;
    }
  }

  return null;
}

export function groupWorkersBySubcategory(
  category: string,
  workers: Worker[]
): WorkerSubgroup[] {
  const normalizedCategory = category.trim().toLowerCase();

  let groups: Array<{ id: string; i18nKey: string; subcategories: string[] }> = [];

  if (normalizedCategory === 'construction') {
    groups = CONSTRUCTION_GROUPS;
  } else if (normalizedCategory === 'tailoring') {
    groups = TAILORING_GROUPS;
  } else {
    // For other categories, return empty array (no grouping)
    return [];
  }

  // Create subgroup structure
  const subgroups: WorkerSubgroup[] = groups.map((group) => ({
    id: group.id,
    i18nKey: group.i18nKey,
    workers: [],
  }));

  // Assign workers to subgroups
  for (const worker of workers) {
    const groupId = getSubgroupForWorker(worker, groups);
    if (groupId) {
      const subgroup = subgroups.find((sg) => sg.id === groupId);
      if (subgroup) {
        subgroup.workers.push(worker);
      }
    }
    // Workers that don't match any subgroup are silently excluded from grouped view
  }

  // Return only subgroups that have workers
  return subgroups.filter((sg) => sg.workers.length > 0);
}
