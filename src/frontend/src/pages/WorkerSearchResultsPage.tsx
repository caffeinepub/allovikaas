import { useState, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, X } from 'lucide-react';
import WorkerCard from '@/components/workers/WorkerCard';
import { useWorkerSearch } from '@/hooks/useWorkerSearch';
import {
  LOCAL_SKILLED_WORKERS_CATEGORY,
  getAllLocalSkilledWorkersSubcategories,
} from '@/config/localSkilledWorkers';

const categories = [
  'Construction',
  'Agriculture',
  'Home Services',
  'Transport',
  'Events & Cooking',
  'Daily Helpers',
  'Repairs',
  'Supplies',
  LOCAL_SKILLED_WORKERS_CATEGORY,
];

const subcategories: Record<string, string[]> = {
  'Construction': ['Mason', 'Carpenter', 'Painter', 'Welder', 'Tiles Worker'],
  'Agriculture': ['Farm Worker', 'Tractor Driver', 'Harvester', 'Irrigation Specialist'],
  'Home Services': ['Electrician', 'Plumber', 'AC Service', 'CCTV Installation', 'Cleaning'],
  'Transport': ['Mini Lorry', 'Load Auto', 'JCB Operator', 'Water Tanker'],
  'Events & Cooking': ['Catering', 'Cook', 'Makeup Artist', 'Mehendi Artist', 'Tent Setup'],
  'Daily Helpers': ['House Help', 'Babysitter', 'Elder Care', 'Driver'],
  'Repairs': ['Mobile Repair', 'Appliance Repair', 'Bike Mechanic', 'Car Mechanic'],
  'Supplies': ['Water Supply', 'Gas Supply', 'Material Supply', 'Equipment Rental'],
  [LOCAL_SKILLED_WORKERS_CATEGORY]: getAllLocalSkilledWorkersSubcategories(),
};

export default function WorkerSearchResultsPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as {
    area?: string;
    category?: string;
    subcategory?: string;
  };

  // Normalize search params to handle unknown values
  const normalizedCategory = searchParams.category && categories.includes(searchParams.category) 
    ? searchParams.category 
    : '';
  
  const normalizedSubcategory = searchParams.subcategory && normalizedCategory && subcategories[normalizedCategory]?.includes(searchParams.subcategory)
    ? searchParams.subcategory
    : '';

  const [searchArea, setSearchArea] = useState(searchParams.area || '');
  const [selectedCategory, setSelectedCategory] = useState(normalizedCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState(normalizedSubcategory);

  const { data: workers = [], isLoading } = useWorkerSearch(
    searchParams.area || '',
    normalizedCategory,
    normalizedSubcategory
  );

  useEffect(() => {
    setSearchArea(searchParams.area || '');
    setSelectedCategory(normalizedCategory);
    setSelectedSubcategory(normalizedSubcategory);
  }, [searchParams.area, normalizedCategory, normalizedSubcategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: '/search',
      search: {
        area: searchArea.trim() || undefined,
        category: selectedCategory || undefined,
        subcategory: selectedSubcategory || undefined,
      },
    });
  };

  const clearFilters = () => {
    setSearchArea('');
    setSelectedCategory('');
    setSelectedSubcategory('');
    navigate({ to: '/search', search: {} });
  };

  const hasActiveFilters = searchParams.area || normalizedCategory || normalizedSubcategory;

  // Get available subcategories safely
  const availableSubcategories = selectedCategory ? (subcategories[selectedCategory] || []) : [];

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Find Workers</h1>
          <p className="text-lg text-muted-foreground">Search by area, category, or subcategory</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-card rounded-2xl shadow-lg p-6 space-y-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Area Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Area / Pincode</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter area or pincode"
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => {
                    setSelectedCategory(value);
                    setSelectedSubcategory('');
                  }}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subcategory Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Sub Category</label>
                <Select
                  value={selectedSubcategory}
                  onValueChange={setSelectedSubcategory}
                  disabled={!selectedCategory || availableSubcategories.length === 0}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="All subcategories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All subcategories</SelectItem>
                    {availableSubcategories.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              {hasActiveFilters && (
                <Button type="button" variant="outline" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </form>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {searchParams.area && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Area: {searchParams.area}
                </span>
              )}
              {normalizedCategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Category: {normalizedCategory}
                </span>
              )}
              {normalizedSubcategory && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  Subcategory: {normalizedSubcategory}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">
              {isLoading ? 'Searching...' : `${workers.length} Workers Found`}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-2xl shadow-md p-6 animate-pulse">
                  <div className="w-full h-48 bg-muted rounded-xl mb-4" />
                  <div className="space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : workers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workers.map((worker) => (
                <WorkerCard key={Number(worker.id)} worker={worker} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-card rounded-2xl shadow-md">
              <p className="text-xl text-muted-foreground mb-2">No workers found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search filters or area
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
