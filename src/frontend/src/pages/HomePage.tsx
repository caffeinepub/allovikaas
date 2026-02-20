import { useState, useCallback } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useI18n } from '@/components/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import PageShell from '@/components/layout/PageShell';
import { useWorkerTaxonomy } from '@/hooks/useWorkerTaxonomy';
import { getCategoryLabel } from '@/utils/categoryLabels';
import { getMainCategoryIcon } from '@/utils/mainCategoryIcons';
import SafeIconImage from '@/components/common/SafeIconImage';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useNaturalLanguageWorkerMatch } from '@/hooks/useNaturalLanguageWorkerMatch';
import HomeWorkerResultsPreview from '@/components/search/HomeWorkerResultsPreview';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import VoiceSearchButton from '@/components/search/VoiceSearchButton';
import LiveSuggestionSearchBox from '@/components/search/LiveSuggestionSearchBox';

export default function HomePage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebouncedValue(searchQuery, 300);

  // Get worker matches for preview
  const { matches, isLoading: isLoadingMatches } = useNaturalLanguageWorkerMatch(debouncedQuery, 8);

  // Voice search
  const handleVoiceTranscript = useCallback((transcript: string) => {
    if (transcript.trim()) {
      // Navigate immediately with the transcript
      navigate({ to: '/search', search: { q: transcript.trim() } });
    }
  }, [navigate]);

  const handleVoiceError = useCallback((error: string) => {
    console.error('Voice recognition error:', error);
  }, []);

  const { isSupported, isListening, startListening, stopListening } = useSpeechRecognition({
    onTranscript: handleVoiceTranscript,
    onError: handleVoiceError,
  });

  // Handle search submission
  const handleSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      navigate({ to: '/search', search: { q: trimmed } });
    }
  }, [navigate]);

  // Handle category click
  const handleCategoryClick = (category: string) => {
    navigate({ to: '/search', search: { category } });
  };

  // Get taxonomy for categories
  const taxonomy = useWorkerTaxonomy();
  const categories = taxonomy.categories || [];

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Find workers near you
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              ஒரு நபரிடம் பேசுவது போல வேலை தேடுங்கள்
            </p>
          </div>

          {/* Search Box with Live Suggestions */}
          <div className="max-w-3xl mx-auto">
            <LiveSuggestionSearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearch}
              placeholder="Eg Tindivanam plumber irukana"
              disabled={isListening}
            >
              <VoiceSearchButton
                isListening={isListening}
                isSupported={isSupported}
                onStart={startListening}
                onStop={stopListening}
              />
            </LiveSuggestionSearchBox>

            {/* Worker Preview */}
            <HomeWorkerResultsPreview
              matches={matches}
              query={debouncedQuery}
              isLoading={isLoadingMatches}
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => {
              const iconPath = getMainCategoryIcon(category);
              const label = getCategoryLabel(category);

              return (
                <Button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  variant="outline"
                  className="h-auto py-6 px-4 flex flex-col items-center gap-3 hover:shadow-lg hover:border-primary transition-all duration-200"
                >
                  <SafeIconImage
                    src={iconPath}
                    alt={label}
                    className="w-16 h-16 object-contain"
                  />
                  <span className="text-sm font-semibold text-center leading-tight">
                    {label}
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* About Section */}
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-lg border border-border">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Find Local Workers Instantly
            </h2>
            <p className="text-lg text-muted-foreground">
              Connect directly with skilled workers in your area. No middleman, no commission.
              Just honest work and fair prices.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
