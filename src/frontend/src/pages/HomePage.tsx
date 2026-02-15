import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import BilingualText from '@/components/i18n/BilingualText';
import { useI18n } from '@/components/i18n/I18nProvider';
import LiveSuggestionSearchBox from '@/components/search/LiveSuggestionSearchBox';
import WorkerCard from '@/components/workers/WorkerCard';
import { useBrowserGeolocation } from '@/hooks/useBrowserGeolocation';
import { useNearbyWorkers } from '@/hooks/useNearbyWorkers';
import { MapPin, Loader2 } from 'lucide-react';
import ConstructionIcon from '@/icons/ConstructionIcon';
import AgricultureIcon from '@/icons/AgricultureIcon';
import HomeIcon from '@/icons/HomeIcon';
import TransportIcon from '@/icons/TransportIcon';
import CookingIcon from '@/icons/CookingIcon';
import HelperIcon from '@/icons/HelperIcon';
import RepairIcon from '@/icons/RepairIcon';
import SuppliesIcon from '@/icons/SuppliesIcon';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');

  // Request geolocation on mount
  const { coords, isRequesting, isGranted, requestLocation } = useBrowserGeolocation(true);

  // Fetch nearby workers when location is available
  const { data: nearbyWorkers = [], isLoading: isLoadingNearby } = useNearbyWorkers({
    location: coords ? { lat: coords.latitude, lon: coords.longitude } : null,
    limit: 12,
    enabled: isGranted && !!coords,
  });

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

  const handleCategoryClick = (category: string) => {
    navigate({
      to: '/search',
      search: { category },
    });
  };

  const categories = [
    { key: 'Construction', Icon: ConstructionIcon },
    { key: 'Agriculture', Icon: AgricultureIcon },
    { key: 'Home Services', Icon: HomeIcon },
    { key: 'Transport', Icon: TransportIcon },
    { key: 'Event Work', Icon: CookingIcon },
    { key: 'Daily Helpers', Icon: HelperIcon },
    { key: 'Repairs', Icon: RepairIcon },
    { key: 'Supplies', Icon: SuppliesIcon },
  ];

  const heroTitle = t('home.hero.title');
  const heroSubtitle = t('home.hero.subtitle');
  const searchPlaceholder = t('home.search.placeholder');
  const categoriesTitle = t('home.categories.title');

  const showNearbySection = isGranted && coords && nearbyWorkers.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <BilingualText
            english={<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">{heroTitle.en}</h1>}
            regional={<p className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">{heroTitle.regional}</p>}
            regionalClassName="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3"
          />

          <BilingualText
            english={<p className="text-lg md:text-xl text-muted-foreground">{heroSubtitle.en}</p>}
            regional={<p className="text-base md:text-lg text-muted-foreground">{heroSubtitle.regional}</p>}
            regionalClassName="text-base md:text-lg text-muted-foreground mt-2"
          />

          {/* Search Box with Live Suggestions */}
          <div className="max-w-2xl mx-auto mt-8">
            <LiveSuggestionSearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
              placeholder={`${searchPlaceholder.en} / ${searchPlaceholder.regional}`}
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">{searchPlaceholder.regional}</p>
          </div>
        </div>
      </section>

      {/* Nearby Workers Section */}
      {showNearbySection && (
        <section className="py-8 px-4 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-primary" />
              <p className="text-base font-medium text-foreground">
                Showing workers near you
              </p>
            </div>

            {isLoadingNearby ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {nearbyWorkers.map((worker) => (
                  <WorkerCard key={worker.id.toString()} worker={worker} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <BilingualText
            english={<h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8">{categoriesTitle.en}</h2>}
            regional={<p className="text-2xl md:text-3xl font-bold text-foreground text-center">{categoriesTitle.regional}</p>}
            regionalClassName="text-2xl md:text-3xl font-bold text-foreground text-center mt-2 mb-8"
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map(({ key, Icon }) => (
              <button
                key={key}
                onClick={() => handleCategoryClick(key)}
                className="group bg-card hover:bg-accent/10 border-2 border-border hover:border-primary rounded-2xl p-6 transition-all duration-200 hover:shadow-2xl hover:scale-105"
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-20 h-20 flex items-center justify-center">
                    <Icon className="w-full h-full" />
                  </div>
                  <span className="text-sm md:text-base font-semibold text-foreground text-center group-hover:text-primary">
                    {key}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Are you a skilled worker?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join our network and connect with customers in your area
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ to: '/register-worker' })}
            className="h-14 px-10 text-lg rounded-xl bg-primary hover:bg-primary-dark text-primary-foreground font-semibold shadow-lg"
          >
            Register as Worker
          </Button>
        </div>
      </section>
    </div>
  );
}
