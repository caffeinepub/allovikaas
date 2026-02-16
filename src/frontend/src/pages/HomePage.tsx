import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search } from 'lucide-react';
import SafeIconImage from '@/components/common/SafeIconImage';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useWorkerTaxonomy } from '@/hooks/useWorkerTaxonomy';
import { getBilingualCategoryLabel } from '@/utils/bilingualTaxonomy';
import { getMainCategoryIcon } from '@/utils/mainCategoryIcons';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useNaturalLanguageWorkerMatch } from '@/hooks/useNaturalLanguageWorkerMatch';
import HomeWorkerResultsPreview from '@/components/search/HomeWorkerResultsPreview';
import VoiceSearchButton from '@/components/search/VoiceSearchButton';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from 'sonner';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [searchValue, setSearchValue] = useState('');

  // Debounce search input for instant matching
  const debouncedQuery = useDebouncedValue(searchValue, 400);

  // Get instant matches using natural language search
  const { matches, isLoading: matchesLoading } = useNaturalLanguageWorkerMatch(debouncedQuery, 8);

  // Fetch categories
  const taxonomy = useWorkerTaxonomy();

  // Voice search integration
  const { isSupported, isListening, startListening, stopListening } = useSpeechRecognition({
    language: 'ta-IN', // Tamil (India) as primary, but will understand English too
    onTranscript: (transcript) => {
      const trimmedTranscript = transcript.trim();
      if (trimmedTranscript) {
        // Fill the search input with the transcript
        setSearchValue(trimmedTranscript);
        
        // Automatically trigger search after a short delay to allow preview to update
        setTimeout(() => {
          navigate({
            to: '/search',
            search: { q: trimmedTranscript },
          });
        }, 300);
      }
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate({
        to: '/search',
        search: { q: searchValue.trim() },
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate({
      to: '/search',
      search: { category },
    });
  };

  // Get translated strings
  const heroTitle = t('home.nlSearch.title');
  const heroSubtitle = t('home.nlSearch.subtitle');
  const searchPlaceholder = t('home.nlSearch.placeholder');
  const categoriesTitle = t('home.categoriesHeading');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      {/* Hero Section with AI-style Natural Language Search */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {heroTitle.en}
            </h1>
            <p className="text-xl text-muted-foreground">
              {heroSubtitle.en}
            </p>
            <p className="text-lg text-muted-foreground/80 mt-2">
              {heroSubtitle.regional}
            </p>
          </div>

          {/* AI-style Chat Search Box with Voice Search */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="space-y-2">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={searchPlaceholder.en}
                    className="h-14 text-lg rounded-full px-6 pr-14 shadow-lg border-2 border-border focus:border-primary"
                  />
                  <VoiceSearchButton
                    isListening={isListening}
                    isSupported={isSupported}
                    onStart={startListening}
                    onStop={stopListening}
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="px-8 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </form>

            {/* Instant Results Preview */}
            <HomeWorkerResultsPreview
              matches={matches}
              query={debouncedQuery}
              isLoading={matchesLoading}
            />
          </div>

          {/* Example queries */}
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3">Try examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'tindivanam plumber irukana',
                'AC repair near me',
                'cooking aunty venum nalaiku',
                'painting work venum',
              ].map((example) => (
                <button
                  key={example}
                  onClick={() => setSearchValue(example)}
                  className="px-4 py-2 text-sm bg-background/80 hover:bg-background border border-border rounded-full transition-colors"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            {categoriesTitle.en}
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

      {/* Worker Registration CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary text-primary-foreground rounded-2xl shadow-2xl">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Are you a skilled worker?
              </h2>
              <p className="text-lg opacity-90">
                Register now and connect with people looking for your services
              </p>
              <Button
                onClick={() => navigate({ to: '/register' })}
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6"
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
