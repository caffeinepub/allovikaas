import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useWorkerSearch } from '@/hooks/useWorkerSearch';
import { useWorkerTaxonomy, getSubcategoriesForCategory } from '@/hooks/useWorkerTaxonomy';
import WorkerCard from '@/components/workers/WorkerCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import { getBilingualCategoryLabel, getBilingualSubcategoryLabel } from '@/utils/bilingualTaxonomy';
import PageShell from '@/components/layout/PageShell';

export default function WorkerSearchResultsPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/search' });
  const { t } = useI18n();
  const taxonomy = useWorkerTaxonomy();

  const [area, setArea] = useState(searchParams.area || '');
  const [category, setCategory] = useState(searchParams.category || '');
  const [subcategory, setSubcategory] = useState(searchParams.subcategory || '');

  const { data: workers = [], isLoading, isError } = useWorkerSearch(area, category, subcategory);

  useEffect(() => {
    setArea(searchParams.area || '');
    setCategory(searchParams.category || '');
    setSubcategory(searchParams.subcategory || '');
  }, [searchParams.area, searchParams.category, searchParams.subcategory]);

  const handleSearch = () => {
    navigate({
      to: '/search',
      search: {
        area: area.trim() || undefined,
        category: category || undefined,
        subcategory: subcategory || undefined,
      },
    });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setSubcategory('');
  };

  const availableSubcategories = category ? getSubcategoriesForCategory(category, taxonomy) : [];
  const subcategoryDisabled = !category || availableSubcategories.length === 0;
  const subcategoryPlaceholder = !category 
    ? t('search.filter.selectCategoryFirst').en 
    : availableSubcategories.length === 0 
    ? 'No subcategories available' 
    : t('search.filter.subcategory').en;

  const searchTitle = t('search.title');
  const searchSubtitle = t('search.subtitle');
  const filterArea = t('search.filter.area');
  const filterCategory = t('search.filter.category');
  const filterSubcategory = t('search.filter.subcategory');
  const filterSelectCategory = t('search.filter.selectCategory');
  const filterSelectSubcategory = t('search.filter.subcategory');
  const filterSelectCategoryFirst = t('search.filter.selectCategoryFirst');
  const buttonSearch = t('search.button.search');
  const resultsFound = t('search.results.found');
  const resultsNone = t('search.results.none');
  const resultsLoading = t('search.results.loading');
  const resultsError = t('search.results.error');

  return (
    <PageShell variant="compact">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <BilingualText
            english={<h1 className="text-3xl md:text-4xl font-bold text-foreground">{searchTitle.en}</h1>}
            regional={<p className="text-2xl md:text-3xl font-semibold text-foreground">{searchTitle.regional}</p>}
            regionalClassName="text-2xl md:text-3xl font-semibold text-foreground mt-2"
          />
          <BilingualText
            english={<p className="text-base md:text-lg text-muted-foreground">{searchSubtitle.en}</p>}
            regional={<p className="text-sm md:text-base text-muted-foreground">{searchSubtitle.regional}</p>}
            regionalClassName="text-sm md:text-base text-muted-foreground mt-1"
          />
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                <BilingualText
                  english={<span>{filterArea.en}</span>}
                  regional={<span className="text-xs">{filterArea.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-xs mt-0.5"
                />
              </label>
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder={filterArea.en}
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                <BilingualText
                  english={<span>{filterCategory.en}</span>}
                  regional={<span className="text-xs">{filterCategory.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-xs mt-0.5"
                />
              </label>
              <Select value={category} onValueChange={handleCategoryChange} disabled={taxonomy.isLoading}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={taxonomy.isLoading ? 'Loading...' : filterSelectCategory.en} />
                </SelectTrigger>
                <SelectContent>
                  {taxonomy.categories.map((cat) => {
                    const label = getBilingualCategoryLabel(cat, t);
                    return (
                      <SelectItem key={cat} value={cat}>
                        <div className="flex flex-col">
                          <span>{label.en}</span>
                          <span className="text-xs text-muted-foreground">{label.regional}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                <BilingualText
                  english={<span>{filterSubcategory.en}</span>}
                  regional={<span className="text-xs">{filterSubcategory.regional}</span>}
                  containerClassName="flex flex-col"
                  regionalClassName="text-xs mt-0.5"
                />
              </label>
              <Select value={subcategory} onValueChange={setSubcategory} disabled={subcategoryDisabled}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder={subcategoryPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {availableSubcategories.map((sub) => {
                    const label = getBilingualSubcategoryLabel(sub, t);
                    return (
                      <SelectItem key={sub} value={sub}>
                        <div className="flex flex-col">
                          <span>{label.en}</span>
                          <span className="text-xs text-muted-foreground">{label.regional}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full h-10 bg-primary hover:bg-primary-dark text-primary-foreground">
                <Search className="h-4 w-4 mr-2" />
                {buttonSearch.en}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <BilingualText
                english={<p className="text-lg text-muted-foreground">{resultsLoading.en}</p>}
                regional={<p className="text-base text-muted-foreground">{resultsLoading.regional}</p>}
                regionalClassName="text-base text-muted-foreground mt-1"
              />
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <AlertCircle className="h-12 w-12 text-destructive" />
              <BilingualText
                english={<p className="text-lg text-destructive">{resultsError.en}</p>}
                regional={<p className="text-base text-destructive">{resultsError.regional}</p>}
                regionalClassName="text-base text-destructive mt-1"
              />
            </div>
          )}

          {!isLoading && !isError && workers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <BilingualText
                english={<p className="text-lg text-muted-foreground">{resultsNone.en}</p>}
                regional={<p className="text-base text-muted-foreground">{resultsNone.regional}</p>}
                regionalClassName="text-base text-muted-foreground mt-1"
              />
            </div>
          )}

          {!isLoading && !isError && workers.length > 0 && (
            <>
              <div className="text-center">
                <BilingualText
                  english={<p className="text-lg font-semibold text-foreground">{resultsFound.en.replace('{count}', workers.length.toString())}</p>}
                  regional={<p className="text-base font-semibold text-foreground">{resultsFound.regional.replace('{count}', workers.length.toString())}</p>}
                  regionalClassName="text-base font-semibold text-foreground mt-1"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {workers.map((worker) => (
                  <WorkerCard key={worker.id.toString()} worker={worker} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </PageShell>
  );
}
