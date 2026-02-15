import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNearbyWorkers } from '@/hooks/useNearbyWorkers';
import { useBrowserGeolocation } from '@/hooks/useBrowserGeolocation';
import { calculateDistance } from '@/utils/workerDistance';
import WorkerCard from '@/components/workers/WorkerCard';
import { getCategoryLabel } from '@/utils/categoryLabels';
import type { Location } from '@/backend';

interface SearchEmptyRecoveryProps {
  searchQuery?: string;
  category?: string;
  subcategory?: string;
  area?: string;
}

/**
 * Mobile-first smart recovery component for empty search results
 * Shows nearby workers and alternative search suggestions
 * 
 * Displays formatted category labels using getCategoryLabel() while preserving
 * original values for navigation.
 */
export default function SearchEmptyRecovery({
  searchQuery,
  category,
  subcategory,
  area,
}: SearchEmptyRecoveryProps) {
  const navigate = useNavigate();
  const { coords } = useBrowserGeolocation(false);

  // Fetch nearby workers if location is available
  const userLocation: Location | null = coords
    ? { lat: coords.latitude, lon: coords.longitude }
    : null;

  const { data: nearbyWorkers = [] } = useNearbyWorkers({
    location: userLocation,
    limit: 50,
  });

  // Filter and sort nearby workers by distance
  const sortedNearbyWorkers = useMemo(() => {
    if (!coords || nearbyWorkers.length === 0) return [];

    return nearbyWorkers
      .map((worker) => {
        if (!worker.location) return { worker, distance: Infinity };
        const distance = calculateDistance(
          { latitude: coords.latitude, longitude: coords.longitude },
          { latitude: worker.location.lat, longitude: worker.location.lon }
        );
        return { worker, distance };
      })
      .filter((item) => item.distance < 50) // Within 50km
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 6)
      .map((item) => item.worker);
  }, [nearbyWorkers, coords]);

  // Generate alternative search suggestions with formatted labels
  const suggestions = useMemo(() => {
    const items: Array<{ label: string; value: string; type: 'category' | 'area' | 'general' }> = [];

    // If searching by subcategory, suggest the parent category (formatted)
    if (subcategory && category) {
      items.push({
        label: getCategoryLabel(category),
        value: category,
        type: 'category',
      });
    }

    // Suggest removing area filter (formatted)
    if (area && (category || subcategory)) {
      items.push({
        label: subcategory ? getCategoryLabel(subcategory) : getCategoryLabel(category || ''),
        value: subcategory || category || '',
        type: 'general',
      });
    }

    // Popular categories as fallback (formatted)
    if (items.length === 0) {
      const popularCategories = [
        'Construction',
        'Home Services',
        'Tailoring',
        'Agriculture',
        'Daily Helpers',
      ];
      popularCategories.forEach((cat) => {
        items.push({
          label: getCategoryLabel(cat),
          value: cat,
          type: 'category',
        });
      });
    }

    return items;
  }, [category, subcategory, area]);

  const handleSuggestionClick = (value: string, type: string) => {
    if (type === 'category') {
      navigate({
        to: '/search',
        search: { category: value },
      });
    } else {
      navigate({
        to: '/search',
        search: { q: value },
      });
    }
  };

  const handleBrowseAll = () => {
    navigate({ to: '/search', search: {} });
  };

  return (
    <div className="space-y-8 py-8">
      {/* Empty State Message */}
      <Card className="border-2 border-dashed">
        <CardContent className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No workers found
            </h3>
            <p className="text-muted-foreground">
              We couldn't find any workers matching your search criteria.
              Try adjusting your filters or browse suggestions below.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Alternative Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Try these categories
            </h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={() => handleSuggestionClick(suggestion.value, suggestion.type)}
                className="rounded-full"
              >
                {suggestion.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Workers */}
      {sortedNearbyWorkers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Workers near you
            </h3>
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
      )}

      {/* Browse All CTA */}
      <div className="text-center pt-4">
        <Button
          size="lg"
          variant="default"
          onClick={handleBrowseAll}
          className="rounded-full px-8"
        >
          Browse All Workers
        </Button>
      </div>
    </div>
  );
}
