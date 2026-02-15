import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import LiveSuggestionSearchBox from '@/components/search/LiveSuggestionSearchBox';
import WorkerCard from '@/components/workers/WorkerCard';
import SafeIconImage from '@/components/common/SafeIconImage';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useBrowserGeolocation } from '@/hooks/useBrowserGeolocation';
import { useNearbyWorkers } from '@/hooks/useNearbyWorkers';
import { useWorkerTaxonomy } from '@/hooks/useWorkerTaxonomy';
import { getBilingualCategoryLabel } from '@/utils/bilingualTaxonomy';
import { getMainCategoryIcon } from '@/utils/mainCategoryIcons';
import { calculateDistance } from '@/utils/workerDistance';
import type { Location } from '@/backend';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [hasRequestedLocation, setHasRequestedLocation] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  // Request geolocation on mount
  const { coords, requestLocation, isGranted } = useBrowserGeolocation(false);

  useEffect(() => {
    if (!hasRequestedLocation) {
      requestLocation();
      setHasRequestedLocation(true);
    }
  }, [hasRequestedLocation, requestLocation]);

  // Fetch nearby workers if location is available
  const userLocation: Location | null = coords
    ? { lat: coords.latitude, lon: coords.longitude }
    : null;

  const { data: nearbyWorkers = [] } = useNearbyWorkers({
    location: userLocation,
    limit: 50,
  });

  // Sort nearby workers by distance
  const sortedNearbyWorkers = nearbyWorkers
    .map((worker) => {
      if (!worker.location || !coords) return { worker, distance: Infinity };
      const distance = calculateDistance(
        { latitude: coords.latitude, longitude: coords.longitude },
        { latitude: worker.location.lat, longitude: worker.location.lon }
      );
      return { worker, distance };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 6)
    .map((item) => item.worker);

  // Fetch categories
  const taxonomy = useWorkerTaxonomy();

  const handleSearchSubmit = (query: string) => {
    navigate({
      to: '/search',
      search: { q: query },
    });
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

  const handleRegisterClick = () => {
    navigate({ to: '/register' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Hero Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Find Local Workers
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with skilled workers in your area
            </p>
          </div>

          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <LiveSuggestionSearchBox
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={handleSearchSubmit}
              onSuggestionSelect={handleSuggestionSelect}
              placeholder="Search for workers, skills, or services..."
              className="w-full"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {taxonomy.categories.map((categoryName) => {
              const categoryLabel = getBilingualCategoryLabel(categoryName, t);
              const iconPath = getMainCategoryIcon(categoryName);

              return (
                <Card
                  key={categoryName}
                  className="cursor-pointer hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
                  onClick={() => handleCategoryClick(categoryName)}
                >
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="flex justify-center">
                      <SafeIconImage
                        src={iconPath}
                        alt={categoryLabel.en}
                        className="w-20 h-20 object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {categoryLabel.en}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {categoryLabel.regional}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nearby Workers Section */}
      {sortedNearbyWorkers.length > 0 && (
        <section className="py-12 px-4 bg-background/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-8">
              <MapPin className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-foreground">
                Workers Near You
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedNearbyWorkers.map((worker) => (
                <WorkerCard
                  key={worker.id.toString()}
                  worker={worker}
                  userLocation={coords}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Worker Registration CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary text-primary-foreground rounded-2xl shadow-2xl">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Are you a skilled worker?
              </h2>
              <p className="text-xl opacity-90">
                Register now and connect with customers in your area
              </p>
              <Button
                size="lg"
                variant="secondary"
                onClick={handleRegisterClick}
                className="rounded-full px-8 py-6 text-lg font-semibold"
              >
                Register as Worker
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
