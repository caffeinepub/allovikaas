import { useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useGetPublicWorkers } from '@/hooks/useQueries';
import { useIntentWorkerSearch } from '@/hooks/useIntentWorkerSearch';
import { useI18n } from '@/components/i18n/I18nProvider';
import WorkerCard from '@/components/workers/WorkerCard';
import PageShell from '@/components/layout/PageShell';
import { searchWorkers } from '@/utils/smartWorkerSearch';
import { groupWorkersBySubcategory } from '@/utils/workerSubgrouping';
import { formatTaxonomyLabel } from '@/utils/formatTaxonomyLabel';
import { workerMatchesFuzzyQuery, normalizeForSearch } from '@/utils/fuzzyWorkerSearch';
import SearchEmptyRecovery from '@/components/search/SearchEmptyRecovery';

export default function WorkerSearchResultsPage() {
  const { t } = useI18n();
  const search = useSearch({ from: '/search' }) as any;
  const { area, category, subcategory, q } = search;

  // Get public workers (active only) - used for category/area filtering
  const { data: allWorkers = [], isLoading: isLoadingAll, error: errorAll } = useGetPublicWorkers();

  // Use intent-based search for text queries
  const { 
    data: intentResults = [], 
    isLoading: isLoadingIntent, 
    error: errorIntent 
  } = useIntentWorkerSearch(q || '', { limit: 100, minResults: 3 });

  // Determine which data source to use
  const isLoading = q ? isLoadingIntent : isLoadingAll;
  const error = q ? errorIntent : errorAll;

  // Filter and rank workers
  const filteredWorkers = useMemo(() => {
    // If we have a text query, use intent search results
    if (q) {
      return intentResults;
    }

    // Otherwise apply category/area filters with fuzzy matching
    if (!allWorkers || allWorkers.length === 0) return [];
    
    let filtered = allWorkers.filter(w => w.status.__kind__ === 'active');
    
    if (category) {
      const normalizedCategory = normalizeForSearch(category);
      filtered = filtered.filter(w => 
        workerMatchesFuzzyQuery(
          { category: w.category },
          normalizedCategory,
          0.75
        )
      );
    }
    
    if (area) {
      const normalizedArea = normalizeForSearch(area);
      filtered = filtered.filter(w => 
        workerMatchesFuzzyQuery(
          { area: w.area },
          normalizedArea,
          0.75
        )
      );
    }
    
    return filtered;
  }, [allWorkers, intentResults, area, category, q]);

  // Group workers if category requires it
  const groupedWorkers = useMemo(() => {
    if (!category || filteredWorkers.length === 0) return null;
    const groups = groupWorkersBySubcategory(filteredWorkers);
    return groups.length > 0 ? groups : null;
  }, [filteredWorkers, category]);

  // Build search context for worker cards
  const searchContext = useMemo(() => {
    return {
      category: category || undefined,
      area: area || undefined,
    };
  }, [category, area]);

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

  // Show empty recovery only when there are truly zero workers in the system
  const hasQuery = !!(q || category || area);
  const hasWorkers = filteredWorkers.length > 0;

  if (!hasWorkers && hasQuery && allWorkers.length === 0) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4 py-8">
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

  // Always show results when we have workers (intent search guarantees non-empty fallback)
  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{pageTitle}</h1>
          <p className="text-muted-foreground">
            {hasWorkers && filteredWorkers.length < 10 && q
              ? `Showing ${filteredWorkers.length} best match${filteredWorkers.length !== 1 ? 'es' : ''}`
              : `Found ${filteredWorkers.length} worker${filteredWorkers.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {groupedWorkers ? (
          // Grouped display
          <div className="space-y-12">
            {groupedWorkers.map((subgroup) => (
              <div key={subgroup.subgroupName} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground border-b-2 border-primary pb-2">
                  {formatTaxonomyLabel(subgroup.subgroupName)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subgroup.workers.map((worker) => (
                    <WorkerCard
                      key={worker.id.toString()}
                      worker={worker}
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
            {filteredWorkers.map((worker) => (
              <WorkerCard
                key={worker.id.toString()}
                worker={worker}
                searchContext={searchContext}
              />
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
