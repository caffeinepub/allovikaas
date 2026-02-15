import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import SafeIconImage from '@/components/common/SafeIconImage';
import {
  LOCAL_SKILLED_WORKERS_CATEGORY,
  LOCAL_SKILLED_WORKERS_GROUPS,
} from '@/config/localSkilledWorkers';

const categories = [
  { key: 'construction', icon: '/assets/generated/icon-construction.dim_128x128.svg' },
  { key: 'agriculture', icon: '/assets/generated/icon-agriculture.dim_128x128.svg' },
  { key: 'homeservices', icon: '/assets/generated/icon-home-services.dim_128x128.svg' },
  { key: 'transport', icon: '/assets/generated/icon-transport.dim_128x128.svg' },
  { key: 'events', icon: '/assets/generated/icon-events-cooking.dim_128x128.svg' },
  { key: 'helpers', icon: '/assets/generated/icon-daily-helpers.dim_128x128.svg' },
  { key: 'repairs', icon: '/assets/generated/icon-repairs.dim_128x128.svg' },
  { key: 'supplies', icon: '/assets/generated/icon-supplies.dim_128x128.svg' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useI18n();

  const appName = t('app.name');
  const tagline = t('app.tagline');
  const searchLabel = t('hero.search');
  const localSkilledWorkersLabel = t('category.localSkilledWorkers');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { area: searchQuery.trim() } });
    }
  };

  const handleCategoryClick = (categoryKey: string) => {
    try {
      const categoryLabel = t(`category.${categoryKey}`);
      const categoryName = categoryLabel?.en || categoryKey;
      navigate({ to: '/search', search: { category: categoryName } });
    } catch (error) {
      console.error('Error navigating to category:', error);
      navigate({ to: '/search', search: {} });
    }
  };

  const handleSubcategoryClick = (subcategoryLabel: string) => {
    try {
      if (subcategoryLabel) {
        navigate({ to: '/search', search: { subcategory: subcategoryLabel } });
      }
    } catch (error) {
      console.error('Error navigating to subcategory:', error);
      navigate({ to: '/search', search: {} });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-200px)]">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-primary leading-tight">
                {appName?.en || 'AREA WORKER'}
              </h1>
              <BilingualText
                english={<p className="text-xl md:text-3xl text-foreground font-medium">{tagline?.en || 'Find Local Workers'}</p>}
                regional={<p className="text-lg md:text-2xl">{tagline?.regional || ''}</p>}
                regionalClassName="text-lg md:text-2xl mt-2 opacity-80"
              />
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <form onSubmit={handleSearch}>
                <BilingualText
                  english={<p className="text-lg md:text-xl font-semibold mb-4">{searchLabel?.en || 'Search by Area'}</p>}
                  regional={<p className="text-base md:text-lg mb-4">{searchLabel?.regional || ''}</p>}
                  regionalClassName="text-base md:text-lg opacity-80"
                />
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter Area or Pincode"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-14 h-16 text-lg bg-card border-2 border-border focus:border-primary focus:ring-primary rounded-2xl shadow-lg"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
                  >
                    Search
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Category Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground">
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {categories.map((category) => {
                try {
                  const categoryLabel = t(`category.${category.key}`);
                  return (
                    <button
                      key={category.key}
                      onClick={() => handleCategoryClick(category.key)}
                      className="group bg-card hover:bg-accent border-2 border-border hover:border-primary rounded-3xl p-6 md:p-8 transition-all duration-200 shadow-md hover:shadow-xl flex flex-col items-center gap-4"
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                        <SafeIconImage
                          src={category.icon}
                          alt={categoryLabel?.en || category.key}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                        />
                      </div>
                      <BilingualText
                        english={
                          <span className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                            {categoryLabel?.en || category.key}
                          </span>
                        }
                        regional={
                          <span className="text-sm md:text-base font-medium opacity-80">
                            {categoryLabel?.regional || ''}
                          </span>
                        }
                        containerClassName="text-center"
                        regionalClassName="text-sm md:text-base mt-1 opacity-80"
                      />
                    </button>
                  );
                } catch (error) {
                  console.error('Error rendering category:', category.key, error);
                  return null;
                }
              })}
            </div>
          </div>

          {/* Local Skilled Workers Section */}
          <div className="space-y-8 bg-accent/20 rounded-3xl p-6 md:p-10 border-2 border-primary/20">
            <div className="text-center space-y-2">
              <BilingualText
                english={
                  <h2 className="text-3xl md:text-4xl font-bold text-primary">
                    {localSkilledWorkersLabel?.en || LOCAL_SKILLED_WORKERS_CATEGORY}
                  </h2>
                }
                regional={
                  <p className="text-xl md:text-2xl font-semibold text-primary/90">
                    {localSkilledWorkersLabel?.regional || ''}
                  </p>
                }
                regionalClassName="text-xl md:text-2xl mt-2"
              />
            </div>

            {LOCAL_SKILLED_WORKERS_GROUPS.map((group, groupIndex) => {
              try {
                return (
                  <div key={groupIndex} className="space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-foreground border-b-2 border-primary/30 pb-2">
                      {group.groupName || 'Category'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                      {(group.subcategories || []).map((subcategory, subIndex) => {
                        try {
                          return (
                            <button
                              key={subIndex}
                              onClick={() => handleSubcategoryClick(subcategory.label)}
                              className="group bg-card hover:bg-primary/10 border-2 border-border hover:border-primary rounded-2xl p-4 md:p-5 transition-all duration-200 shadow-sm hover:shadow-lg flex flex-col items-center gap-3"
                            >
                              <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                                <SafeIconImage
                                  src={subcategory.icon || '/assets/generated/icon-fallback.dim_128x128.svg'}
                                  alt={subcategory.label || 'Worker'}
                                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-200"
                                  fallbackSrc="/assets/generated/icon-fallback.dim_128x128.svg"
                                />
                              </div>
                              <span className="text-xs md:text-sm font-semibold text-foreground text-center leading-tight group-hover:text-primary transition-colors">
                                {subcategory.label || 'Worker'}
                              </span>
                            </button>
                          );
                        } catch (error) {
                          console.error('Error rendering subcategory:', subcategory, error);
                          return null;
                        }
                      })}
                    </div>
                  </div>
                );
              } catch (error) {
                console.error('Error rendering group:', group, error);
                return null;
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
