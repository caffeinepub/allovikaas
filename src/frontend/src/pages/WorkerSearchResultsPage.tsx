import { useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useWorkerSearch } from '@/hooks/useWorkerSearch';
import { useI18n } from '@/components/i18n/I18nProvider';
import WorkerCard from '@/components/workers/WorkerCard';
import PageShell from '@/components/layout/PageShell';
import { sortWorkersByRelevance } from '@/utils/workerRelevanceSort';
import { groupWorkersBySubcategory } from '@/utils/workerSubgrouping';
import SearchEmptyRecovery from '@/components/search/SearchEmptyRecovery';
import { useBrowserGeolocation } from '@/hooks/useBrowserGeolocation';
import { formatTaxonomyLabel } from '@/utils/formatTaxonomyLabel';

export default function WorkerSearchResultsPage() {
  const { t } = useI18n();
  const search = useSearch({ from: '/search' }) as any;
  const { area, category, subcategory, q } = search;

  const { data: workers = [], isLoading, error } = useWorkerSearch(
    area || '',
    category || '',
    subcategory || ''
  );
  const { coords } = useBrowserGeolocation(false);

  // Sort workers by relevance
  const sortedWorkers = useMemo(() => {
    if (!workers || workers.length === 0) return [];
    return sortWorkersByRelevance(workers, {
      searchQuery: q || category || subcategory,
      areaQuery: area,
    });
  }, [workers, area, category, subcategory, q]);

  // Group workers if category requires it
  const groupedWorkers = useMemo(() => {
    if (!category || sortedWorkers.length === 0) return null;
    const groups = groupWorkersBySubcategory(category, sortedWorkers);
    return groups.length > 0 ? groups : null;
  }, [sortedWorkers, category]);

  // Build search context for worker cards
  const searchContext = useMemo(() => {
    return {
      category: category || undefined,
      subcategory: subcategory || undefined,
      area: area || undefined,
    };
  }, [category, subcategory, area]);

  // Title construction with formatted labels
  const titleParts: string[] = [];
  if (subcategory) {
    titleParts.push(formatTaxonomyLabel(subcategory));
  } else if (category) {
    titleParts.push(formatTaxonomyLabel(category));
  }
  if (area) {
    titleParts.push(`in ${area}`);
  }
  if (q && !category && !subcategory) {
    titleParts.push(q);
  }

  const pageTitle = titleParts.length > 0 ? titleParts.join(' ') : 'Search Results';

  // Convert coords for WorkerCard
  const userCoords = coords
    ? { latitude: coords.latitude, longitude: coords.longitude }
    : null;

  if (isLoading) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-lg text-muted-foreground">Loading workers...</p>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <p className="text-lg text-destructive">Error loading workers</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </div>
      </PageShell>
    );
  }

  if (sortedWorkers.length === 0) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-6">{pageTitle}</h1>
          <SearchEmptyRecovery
            searchQuery={q}
            category={category}
            subcategory={subcategory}
            area={area}
          />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{pageTitle}</h1>
          <p className="text-muted-foreground">
            Found {sortedWorkers.length} worker{sortedWorkers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {groupedWorkers ? (
          // Grouped display
          <div className="space-y-12">
            {groupedWorkers.map((subgroup) => (
              <div key={subgroup.id} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground border-b-2 border-primary pb-2">
                  {formatTaxonomyLabel(subgroup.id)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subgroup.workers.map((worker) => (
                    <WorkerCard
                      key={worker.id.toString()}
                      worker={worker}
                      userLocation={userCoords}
                      searchContext={searchContext}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat display
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWorkers.map((worker) => (
              <WorkerCard
                key={worker.id.toString()}
                worker={worker}
                userLocation={userCoords}
                searchContext={searchContext}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
