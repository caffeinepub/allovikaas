import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WorkerCard from '@/components/workers/WorkerCard';
import { useWorkerSearch } from '@/hooks/useWorkerSearch';
import { useWorkerTextSearch } from '@/hooks/useWorkerTextSearch';
import { useBrowserGeolocation } from '@/hooks/useBrowserGeolocation';
import { useWorkerTaxonomy } from '@/hooks/useWorkerTaxonomy';
import BilingualText from '@/components/i18n/BilingualText';
import { useI18n } from '@/components/i18n/I18nProvider';
import { getBilingualCategoryLabel, getBilingualSubcategoryLabel } from '@/utils/bilingualTaxonomy';
import { groupWorkersBySubcategory } from '@/utils/workerSubgrouping';
import { sortWorkersByRelevance } from '@/utils/workerRelevanceSort';
import PageShell from '@/components/layout/PageShell';
import LiveSuggestionSearchBox from '@/components/search/LiveSuggestionSearchBox';
import SearchEmptyRecovery from '@/components/search/SearchEmptyRecovery';

export default function WorkerSearchResultsPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/search' });
  const { t } = useI18n();

  const { area = '', category = '', subcategory = '', q = '' } = search;

  // Local search input state
  const [searchInput, setSearchInput] = useState(q || '');

  // Request browser geolocation non-blocking
  const { coords: userLocation } = useBrowserGeolocation(true);

  // Fetch taxonomy for empty state suggestions
  const { categories } = useWorkerTaxonomy();

  // Sync local state with URL param
  useEffect(() => {
    setSearchInput(q || '');
  }, [q]);

  // Use text search if 'q' param exists, otherwise use category/area search
  const isTextSearch = !!q;
  const textSearchQuery = useWorkerTextSearch(q || '');
  const categorySearchQuery = useWorkerSearch(area, category, subcategory);

  const { data: rawWorkers = [], isLoading } = isTextSearch ? textSearchQuery : categorySearchQuery;

  // Sort workers by relevance
  const sortedWorkers = useMemo(() => {
    if (!rawWorkers || rawWorkers.length === 0) return [];
    
    return sortWorkersByRelevance(rawWorkers, {
      searchQuery: q || category || subcategory,
      areaQuery: area,
    });
  }, [rawWorkers, q, category, subcategory, area]);

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      navigate({
        to: '/search',
        search: { q: trimmedQuery },
      });
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    navigate({
      to: '/search',
      search: { q: suggestion },
    });
  };

  const handleCategorySelect = (selectedCategory: string) => {
    navigate({
      to: '/search',
      search: { category: selectedCategory },
    });
  };

  const searchTitle = t('search.title');
  const searchPlaceholder = t('home.search.placeholder');

  // Group workers if category is selected without subcategory filter
  const shouldGroup = !isTextSearch && category && !subcategory;
  
  // Apply grouping with sorted workers
  const groupedWorkers = useMemo(() => {
    if (!shouldGroup) return [];
    
    const groups = groupWorkersBySubcategory(category, sortedWorkers);
    
    // Sort workers within each group
    return groups.map(group => ({
      ...group,
      workers: sortWorkersByRelevance(group.workers, {
        searchQuery: category,
        areaQuery: area,
      }),
    }));
  }, [shouldGroup, category, sortedWorkers, area]);

  const categoryLabel = category ? getBilingualCategoryLabel(category, t) : null;
  const subcategoryLabel = subcategory ? getBilingualSubcategoryLabel(subcategory, t) : null;

  // Convert user location to format expected by WorkerCard
  const userCoords = userLocation
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
    : null;

  return (
    <PageShell variant="compact">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <BilingualText
            english={<h1 className="text-3xl md:text-4xl font-bold text-foreground">{searchTitle.en}</h1>}
            regional={<p className="text-2xl md:text-3xl font-semibold text-foreground">{searchTitle.regional}</p>}
            regionalClassName="text-2xl md:text-3xl font-semibold text-foreground mt-2"
          />

          {/* Search Input with Live Suggestions */}
          <div className="max-w-2xl">
            <LiveSuggestionSearchBox
              value={searchInput}
              onChange={setSearchInput}
              onSubmit={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              placeholder={`${searchPlaceholder.en} / ${searchPlaceholder.regional}`}
            />
          </div>

          {/* Active Filters Display */}
          {!isTextSearch && (categoryLabel || area) && (
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="text-muted-foreground">Filters:</span>
              {categoryLabel && (
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  {categoryLabel.en}
                </div>
              )}
              {subcategoryLabel && (
                <div className="bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                  {subcategoryLabel.en}
                </div>
              )}
              {area && (
                <div className="bg-accent/10 text-accent px-3 py-1 rounded-full font-medium">
                  {area}
                </div>
              )}
            </div>
          )}

          {isTextSearch && q && (
            <div className="flex flex-wrap gap-2 items-center text-sm">
              <span className="text-muted-foreground">Searching for:</span>
              <div className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                "{q}"
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading workers...</p>
          </div>
        )}

        {/* Results */}
        {!isLoading && sortedWorkers.length > 0 && (
          <>
            {shouldGroup && groupedWorkers.length > 0 ? (
              // Grouped view (by subgroup)
              <div className="space-y-10">
                {groupedWorkers.map((group) => {
                  const groupLabel = t(group.i18nKey);
                  return (
                    <div key={group.id}>
                      <BilingualText
                        english={<h2 className="text-2xl font-bold text-foreground mb-4">{groupLabel.en}</h2>}
                        regional={<p className="text-xl font-semibold text-foreground">{groupLabel.regional}</p>}
                        regionalClassName="text-xl font-semibold text-foreground mt-1 mb-4"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {group.workers.map((worker) => (
                          <WorkerCard
                            key={worker.id.toString()}
                            worker={worker}
                            userLocation={userCoords}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Single list view
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedWorkers.map((worker) => (
                  <WorkerCard
                    key={worker.id.toString()}
                    worker={worker}
                    userLocation={userCoords}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* No Results - Smart Recovery Empty State */}
        {!isLoading && sortedWorkers.length === 0 && (
          <SearchEmptyRecovery
            searchQuery={q}
            category={category}
            subcategory={subcategory}
            area={area}
          />
        )}
      </div>
    </PageShell>
  );
}
