import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { MapPin, Briefcase, MessageCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BilingualText from '@/components/i18n/BilingualText';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useBrowserGeolocation } from '@/hooks/useBrowserGeolocation';
import { useNearbyWorkers } from '@/hooks/useNearbyWorkers';
import { useLiveSearchSuggestions } from '@/hooks/useLiveSearchSuggestions';
import { useWorkerTaxonomy } from '@/hooks/useWorkerTaxonomy';
import WorkerCard from '@/components/workers/WorkerCard';
import { getBilingualSubcategoryLabel } from '@/utils/bilingualTaxonomy';
import { Location } from '@/backend';

interface SearchEmptyRecoveryProps {
  searchQuery?: string;
  category?: string;
  subcategory?: string;
  area?: string;
}

export default function SearchEmptyRecovery({
  searchQuery,
  category,
  subcategory,
  area,
}: SearchEmptyRecoveryProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [radiusKm, setRadiusKm] = useState(10);

  // Get browser geolocation
  const { coords: userLocation, isGranted } = useBrowserGeolocation(true);

  // Convert to backend Location format
  const location: Location | null = userLocation
    ? { lat: userLocation.latitude, lon: userLocation.longitude }
    : null;

  // Fetch nearby workers with expanded limit for client-side filtering
  const { data: nearbyWorkers = [], isLoading: nearbyLoading } = useNearbyWorkers({
    location,
    limit: 50, // Fetch more for client-side radius filtering
    enabled: isGranted && !!location,
  });

  // Filter nearby workers by current radius
  const filteredNearbyWorkers = useMemo(() => {
    if (!nearbyWorkers || !location) return [];
    
    return nearbyWorkers.filter((worker) => {
      if (!worker.location) return false;
      
      // Calculate distance using Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = ((worker.location.lat - location.lat) * Math.PI) / 180;
      const dLon = ((worker.location.lon - location.lon) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((location.lat * Math.PI) / 180) *
          Math.cos((worker.location.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      
      return distance <= radiusKm;
    }).slice(0, 6); // Show max 6 nearby workers
  }, [nearbyWorkers, location, radiusKm]);

  // Get live suggestions based on search query
  const { data: liveSuggestions = [] } = useLiveSearchSuggestions(searchQuery || '');

  // Get taxonomy for fallback suggestions
  const { categories } = useWorkerTaxonomy();

  // Build related suggestions
  const relatedSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    
    // Add live suggestions first (already deduped by hook)
    if (liveSuggestions.length > 0) {
      liveSuggestions.slice(0, 6).forEach((s) => {
        suggestions.push(s.text);
      });
    }
    
    // If we have a category/subcategory, add related subcategories
    if (category && categories.length > 0) {
      const categoryData = categories.find(
        (c) => c.toLowerCase() === category.toLowerCase()
      );
      
      if (categoryData) {
        // This would need subcategories from taxonomy - for now use fallback
      }
    }
    
    // Fallback: add some common skills if we don't have enough suggestions
    if (suggestions.length < 3) {
      const fallbackSkills = [
        'Plumber',
        'Electrician',
        'Carpenter',
        'Painter',
        'Mason',
        'Welder',
      ];
      
      fallbackSkills.forEach((skill) => {
        if (suggestions.length < 6 && !suggestions.includes(skill)) {
          suggestions.push(skill);
        }
      });
    }
    
    return suggestions;
  }, [liveSuggestions, category, categories]);

  // Handlers
  const handleSuggestionClick = (suggestion: string) => {
    navigate({
      to: '/search',
      search: { q: suggestion },
    });
  };

  const handleExpandRadius = () => {
    setRadiusKm((prev) => prev + 10); // Increase by 10km
  };

  const handlePostJob = () => {
    navigate({ to: '/post-job' });
  };

  const handleWhatsAppHelp = () => {
    // Open WhatsApp with a help message
    const message = encodeURIComponent('I need help finding workers in my area');
    window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  // Get translations
  const emptyMessage = t('search.empty.message');
  const nearbyTitle = t('search.empty.nearby.title');
  const suggestionsTitle = t('search.empty.suggestions.title');
  const postJobButton = t('search.empty.action.postJob');
  const expandSearchButton = t('search.empty.action.expandSearch');
  const whatsappPrompt = t('search.empty.whatsapp.prompt');
  const whatsappButton = t('search.empty.whatsapp.button');

  // Convert user location for WorkerCard
  const userCoords = userLocation
    ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
    : null;

  return (
    <div className="space-y-8 py-8">
      {/* Friendly Message */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="p-6 text-center space-y-4">
          <div className="text-5xl">🔍</div>
          <BilingualText
            english={
              <p className="text-lg font-semibold text-foreground leading-relaxed">
                {emptyMessage.en}
              </p>
            }
            regional={
              <p className="text-xl font-semibold text-foreground leading-relaxed">
                {emptyMessage.regional}
              </p>
            }
            regionalClassName="text-xl font-semibold text-foreground leading-relaxed mt-2"
          />
        </CardContent>
      </Card>

      {/* Primary Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={handlePostJob}
          size="lg"
          className="w-full h-16 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <Briefcase className="mr-3 h-6 w-6" />
          <BilingualText
            english={<span>{postJobButton.en}</span>}
            regional={<span className="text-base">{postJobButton.regional}</span>}
            regionalClassName="text-base ml-2"
          />
        </Button>

        {isGranted && location && (
          <Button
            onClick={handleExpandRadius}
            size="lg"
            variant="secondary"
            className="w-full h-16 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            <MapPin className="mr-3 h-6 w-6" />
            <BilingualText
              english={<span>{expandSearchButton.en}</span>}
              regional={<span className="text-base">{expandSearchButton.regional}</span>}
              regionalClassName="text-base ml-2"
            />
          </Button>
        )}
      </div>

      {/* Nearby Workers Section */}
      {isGranted && location && filteredNearbyWorkers.length > 0 && (
        <div className="space-y-4">
          <BilingualText
            english={
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="h-6 w-6 text-primary" />
                {nearbyTitle.en}
                <span className="text-base font-normal text-muted-foreground">
                  (within {radiusKm}km)
                </span>
              </h2>
            }
            regional={
              <p className="text-xl font-semibold text-foreground">
                {nearbyTitle.regional}
              </p>
            }
            regionalClassName="text-xl font-semibold text-foreground mt-1"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNearbyWorkers.map((worker) => (
              <WorkerCard
                key={worker.id.toString()}
                worker={worker}
                userLocation={userCoords}
              />
            ))}
          </div>

          {nearbyWorkers.length > filteredNearbyWorkers.length && (
            <div className="text-center">
              <Button
                onClick={handleExpandRadius}
                variant="outline"
                size="lg"
                className="rounded-full px-8"
              >
                <BilingualText
                  english={<span>Show more workers</span>}
                  regional={<span>மேலும் தொழிலாளர்களைக் காட்டு</span>}
                  regionalClassName="ml-2"
                />
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Related Suggestions */}
      {relatedSuggestions.length > 0 && (
        <div className="space-y-4">
          <BilingualText
            english={
              <h2 className="text-2xl font-bold text-foreground">
                {suggestionsTitle.en}
              </h2>
            }
            regional={
              <p className="text-xl font-semibold text-foreground">
                {suggestionsTitle.regional}
              </p>
            }
            regionalClassName="text-xl font-semibold text-foreground mt-1"
          />

          <div className="flex flex-wrap gap-3">
            {relatedSuggestions.map((suggestion, index) => {
              // Get bilingual label for suggestion
              const suggestionLabel = getBilingualSubcategoryLabel(suggestion, t);
              
              return (
                <Button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  variant="outline"
                  size="lg"
                  className="rounded-full px-6 py-6 text-base font-semibold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm hover:shadow-md"
                >
                  {suggestionLabel.en}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* WhatsApp Help CTA */}
      <Card className="border-2 border-green-200 bg-green-50/50">
        <CardContent className="p-6 text-center space-y-4">
          <BilingualText
            english={
              <p className="text-lg font-semibold text-foreground">
                {whatsappPrompt.en}
              </p>
            }
            regional={
              <p className="text-xl font-semibold text-foreground">
                {whatsappPrompt.regional}
              </p>
            }
            regionalClassName="text-xl font-semibold text-foreground mt-2"
          />

          <Button
            onClick={handleWhatsAppHelp}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-full px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
          >
            <MessageCircle className="mr-3 h-6 w-6" />
            <BilingualText
              english={<span>{whatsappButton.en}</span>}
              regional={<span>{whatsappButton.regional}</span>}
              regionalClassName="ml-2"
            />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
