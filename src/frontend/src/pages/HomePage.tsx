import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Briefcase, Users, Heart } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import SafeIconImage from '@/components/common/SafeIconImage';
import PageShell from '@/components/layout/PageShell';
import { LOCAL_SKILLED_WORKERS_CATEGORY, getLocalSkilledWorkersSubcategories } from '@/config/localSkilledWorkers';

export default function HomePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [searchArea, setSearchArea] = useState('');

  const handleAreaSearch = () => {
    if (searchArea.trim()) {
      navigate({
        to: '/search',
        search: { area: searchArea.trim() },
      });
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate({
      to: '/search',
      search: { category },
    });
  };

  const heroTitle = t('home.hero.title');
  const heroSubtitle = t('home.hero.subtitle');
  const heroSearchPlaceholder = t('home.hero.searchPlaceholder');
  const heroSearchButton = t('home.hero.searchButton');

  const categoriesTitle = t('home.categories.title');
  const categoriesSubtitle = t('home.categories.subtitle');

  const localWorkersTitle = t('home.localWorkers.title');
  const localWorkersSubtitle = t('home.localWorkers.subtitle');

  const ctaTitle = t('home.cta.title');
  const ctaSubtitle = t('home.cta.subtitle');
  const ctaButton = t('home.cta.button');

  const categories = [
    { name: 'Construction', icon: '/assets/generated/icon-construction.dim_128x128.svg' },
    { name: 'Agriculture', icon: '/assets/generated/icon-agriculture.dim_128x128.svg' },
    { name: 'Home Services', icon: '/assets/generated/icon-home-services.dim_128x128.svg' },
    { name: 'Transport', icon: '/assets/generated/icon-transport.dim_128x128.svg' },
    { name: 'Events & Cooking', icon: '/assets/generated/icon-events-cooking.dim_128x128.svg' },
    { name: 'Daily Helpers', icon: '/assets/generated/icon-daily-helpers.dim_128x128.svg' },
    { name: 'Repairs', icon: '/assets/generated/icon-repairs.dim_128x128.svg' },
    { name: 'Supplies', icon: '/assets/generated/icon-supplies.dim_128x128.svg' },
  ];

  const localSkilledWorkers = getLocalSkilledWorkersSubcategories();

  return (
    <PageShell>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 py-8">
          <div className="space-y-3">
            <BilingualText
              english={<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">{heroTitle.en}</h1>}
              regional={<p className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">{heroTitle.regional}</p>}
              regionalClassName="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mt-3"
            />
            <BilingualText
              english={<p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{heroSubtitle.en}</p>}
              regional={<p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">{heroSubtitle.regional}</p>}
              regionalClassName="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mt-2"
            />
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={searchArea}
                  onChange={(e) => setSearchArea(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAreaSearch()}
                  placeholder={heroSearchPlaceholder.en}
                  className="pl-10 h-12 text-base"
                />
              </div>
              <Button onClick={handleAreaSearch} size="lg" className="h-12 px-6 bg-primary hover:bg-primary-dark text-primary-foreground">
                <Search className="h-5 w-5 mr-2" />
                {heroSearchButton.en}
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-5">
          <div className="text-center space-y-2">
            <BilingualText
              english={<h2 className="text-3xl md:text-4xl font-bold text-foreground">{categoriesTitle.en}</h2>}
              regional={<p className="text-2xl md:text-3xl font-semibold text-foreground">{categoriesTitle.regional}</p>}
              regionalClassName="text-2xl md:text-3xl font-semibold text-foreground mt-2"
            />
            <BilingualText
              english={<p className="text-base md:text-lg text-muted-foreground">{categoriesSubtitle.en}</p>}
              regional={<p className="text-sm md:text-base text-muted-foreground">{categoriesSubtitle.regional}</p>}
              regionalClassName="text-sm md:text-base text-muted-foreground mt-1"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => {
              const label = t(`categories.${category.name.toLowerCase().replace(/\s+/g, '')}`);
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategoryClick(category.name)}
                  className="bg-card hover:bg-accent/50 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-200 group"
                >
                  <div className="flex flex-col items-center space-y-3">
                    <div className="bg-primary/10 rounded-xl p-4 group-hover:bg-primary/20 transition-colors">
                      <SafeIconImage
                        src={category.icon}
                        alt={category.name}
                        className="h-12 w-12 object-contain"
                        fallbackSrc="/assets/generated/icon-fallback.dim_128x128.svg"
                      />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-semibold text-foreground text-sm">{label.en}</p>
                      <p className="text-xs text-muted-foreground">{label.regional}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Local Skilled Workers Section */}
        <div className="space-y-5">
          <div className="text-center space-y-2">
            <BilingualText
              english={<h2 className="text-3xl md:text-4xl font-bold text-foreground">{localWorkersTitle.en}</h2>}
              regional={<p className="text-2xl md:text-3xl font-semibold text-foreground">{localWorkersTitle.regional}</p>}
              regionalClassName="text-2xl md:text-3xl font-semibold text-foreground mt-2"
            />
            <BilingualText
              english={<p className="text-base md:text-lg text-muted-foreground">{localWorkersSubtitle.en}</p>}
              regional={<p className="text-sm md:text-base text-muted-foreground">{localWorkersSubtitle.regional}</p>}
              regionalClassName="text-sm md:text-base text-muted-foreground mt-1"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {localSkilledWorkers.map((worker) => (
              <button
                key={worker.subcategory}
                onClick={() => navigate({
                  to: '/search',
                  search: { category: LOCAL_SKILLED_WORKERS_CATEGORY, subcategory: worker.subcategory },
                })}
                className="bg-card hover:bg-accent/50 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="bg-secondary/10 rounded-lg p-3 group-hover:bg-secondary/20 transition-colors">
                    <SafeIconImage
                      src={worker.icon}
                      alt={worker.subcategory}
                      className="h-10 w-10 object-contain"
                      fallbackSrc="/assets/generated/icon-fallback.dim_128x128.svg"
                    />
                  </div>
                  <div className="text-center space-y-0.5">
                    <p className="font-medium text-foreground text-xs">{worker.label.en}</p>
                    <p className="text-xs text-muted-foreground">{worker.label.regional}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 md:p-12 text-center space-y-5">
          <div className="space-y-3">
            <BilingualText
              english={<h2 className="text-3xl md:text-4xl font-bold text-foreground">{ctaTitle.en}</h2>}
              regional={<p className="text-2xl md:text-3xl font-semibold text-foreground">{ctaTitle.regional}</p>}
              regionalClassName="text-2xl md:text-3xl font-semibold text-foreground mt-2"
            />
            <BilingualText
              english={<p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">{ctaSubtitle.en}</p>}
              regional={<p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">{ctaSubtitle.regional}</p>}
              regionalClassName="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mt-2"
            />
          </div>
          <Button
            onClick={() => navigate({ to: '/register-worker' })}
            size="lg"
            className="h-12 px-8 text-base font-semibold bg-primary hover:bg-primary-dark text-primary-foreground"
          >
            <Briefcase className="h-5 w-5 mr-2" />
            {ctaButton.en}
          </Button>
        </div>

        {/* Footer Attribution */}
        <div className="text-center py-6 border-t border-border/50">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-1">© {new Date().getFullYear()} AREA WORKER. All rights reserved.</p>
        </div>
      </div>
    </PageShell>
  );
}
