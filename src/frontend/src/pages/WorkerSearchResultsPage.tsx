import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import WorkerCard from '@/components/workers/WorkerCard';
import { useWorkerSearch } from '@/hooks/useWorkerSearch';
import { useWorkerTaxonomy, isValidCategory, isValidSubcategory, getSubcategoriesForCategory } from '@/hooks/useWorkerTaxonomy';
import { getErrorMessage } from '@/utils/errors';

interface SearchParams {
  area?: string;
  category?: string;
  subcategory?: string;
}

export default function WorkerSearchResultsPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/search' }) as SearchParams;
  const taxonomy = useWorkerTaxonomy();

  // Normalize and validate URL params against taxonomy with safe guards
  const normalizeCategory = (cat: string | undefined): string => {
    if (!cat || typeof cat !== 'string') return '';
    try {
      // Wait for taxonomy to load before validating
      if (taxonomy.isLoading) return cat;
      
      // Check if valid in current taxonomy
      if (isValidCategory(cat, taxonomy)) return cat;
      
      // Fallback: check if it exists in any form (case-insensitive)
      const found = taxonomy.categories.find(c => c.toLowerCase() === cat.toLowerCase());
      return found || '';
    } catch (error) {
      console.error('Error normalizing category:', error);
      return '';
    }
  };

  const normalizeSubcategory = (cat: string, sub: string | undefined): string => {
    if (!sub || !cat || typeof sub !== 'string' || typeof cat !== 'string') return '';
    try {
      // Wait for taxonomy to load before validating
      if (taxonomy.isLoading) return sub;
      
      // Check if valid under the given category
      if (isValidSubcategory(cat, sub, taxonomy)) return sub;
      
      // Fallback: check if it exists in the category's subcategories (case-insensitive)
      const subcats = getSubcategoriesForCategory(cat, taxonomy);
      const found = subcats.find(s => s.toLowerCase() === sub.toLowerCase());
      return found || '';
    } catch (error) {
      console.error('Error normalizing subcategory:', error);
      return '';
    }
  };

  const initialArea = searchParams.area || '';
  const initialCategory = normalizeCategory(searchParams.category);
  const initialSubcategory = normalizeSubcategory(initialCategory, searchParams.subcategory);

  const [area, setArea] = useState(initialArea);
  const [category, setCategory] = useState(initialCategory);
  const [subcategory, setSubcategory] = useState(initialSubcategory);

  // Update state when URL params change or taxonomy loads
  useEffect(() => {
    try {
      // Only normalize once taxonomy is loaded
      if (!taxonomy.isLoading) {
        const newCategory = normalizeCategory(searchParams.category);
        const newSubcategory = normalizeSubcategory(newCategory, searchParams.subcategory);
        setArea(searchParams.area || '');
        setCategory(newCategory);
        setSubcategory(newSubcategory);
      }
    } catch (error) {
      console.error('Error updating search params:', error);
    }
  }, [searchParams.area, searchParams.category, searchParams.subcategory, taxonomy.isLoading, taxonomy.categories.length]);

  const { data: workers = [], isLoading, error } = useWorkerSearch(area, category, subcategory);

  const handleSearch = () => {
    try {
      const params: SearchParams = {};
      if (area.trim()) params.area = area.trim();
      if (category) params.category = category;
      if (subcategory) params.subcategory = subcategory;

      navigate({
        to: '/search',
        search: params,
      });
    } catch (error) {
      console.error('Error handling search:', error);
    }
  };

  const handleClearFilters = () => {
    try {
      setArea('');
      setCategory('');
      setSubcategory('');
      navigate({
        to: '/search',
        search: {},
      });
    } catch (error) {
      console.error('Error clearing filters:', error);
    }
  };

  const hasActiveFilters = area || category || subcategory;

  // Get available subcategories safely from taxonomy
  const availableSubcategories = category ? getSubcategoriesForCategory(category, taxonomy) : [];

  // Reset subcategory when category changes and current subcategory is invalid
  useEffect(() => {
    try {
      if (!taxonomy.isLoading && category && subcategory && !isValidSubcategory(category, subcategory, taxonomy)) {
        setSubcategory('');
      }
    } catch (error) {
      console.error('Error validating subcategory:', error);
    }
  }, [category, subcategory, taxonomy.isLoading, taxonomy.subcategoriesMap]);

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Find Workers</h1>
            
            {/* Search Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Area Input */}
              <div className="md:col-span-1">
                <Input
                  type="text"
                  placeholder="Enter area..."
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="h-11"
                  disabled={taxonomy.isLoading}
                />
              </div>

              {/* Category Select */}
              <div className="md:col-span-1">
                <Select
                  value={category}
                  onValueChange={(value) => {
                    setCategory(value);
                    setSubcategory('');
                  }}
                  disabled={taxonomy.isLoading}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={taxonomy.isLoading ? "Loading..." : "All Categories"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {taxonomy.categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Select */}
              <div className="md:col-span-1">
                <Select
                  value={subcategory}
                  onValueChange={setSubcategory}
                  disabled={!category || availableSubcategories.length === 0 || taxonomy.isLoading}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder={category ? "All Subcategories" : "Select category first"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Subcategories</SelectItem>
                    {availableSubcategories.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-1 flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={taxonomy.isLoading}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="h-11 px-3"
                    disabled={taxonomy.isLoading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="text-muted-foreground">Filters:</span>
                {area && (
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">
                    Area: {area}
                  </span>
                )}
                {category && (
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                    Category: {category}
                  </span>
                )}
                {subcategory && (
                  <span className="bg-accent/10 text-accent px-3 py-1 rounded-full">
                    Subcategory: {subcategory}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Loading workers...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-6 max-w-md mx-auto">
              <p className="font-medium">Failed to load workers</p>
              <p className="text-sm mt-2 opacity-80">{getErrorMessage(error)}</p>
            </div>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-muted/50 rounded-2xl p-12 max-w-md mx-auto">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No workers found</h3>
              <p className="text-muted-foreground mb-6">
                {hasActiveFilters
                  ? 'Try adjusting your search filters'
                  : 'Start by entering an area or selecting a category'}
              </p>
              {hasActiveFilters && (
                <Button onClick={handleClearFilters} variant="outline">
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">
                {workers.length} {workers.length === 1 ? 'Worker' : 'Workers'} Found
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <WorkerCard key={worker.id.toString()} worker={worker} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
