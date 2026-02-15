import { Heart } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { useI18n } from '../i18n/I18nProvider';
import BilingualText from '../i18n/BilingualText';

export default function FooterBar() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'area-worker';
  
  const { t } = useI18n();
  const appName = t('app.name');
  const community = t('footer.community');
  const noMiddleman = t('footer.nomiddleman');
  const noCommission = t('footer.nocommission');
  const contactWA = t('footer.contact');

  return (
    <footer className="border-t border-border bg-card/80 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <h3 className="text-2xl md:text-3xl font-bold text-primary">
              {appName.en}
            </h3>

            <div className="space-y-4">
              <BilingualText
                english={<p className="text-base md:text-lg text-foreground font-medium">{community.en}</p>}
                regional={<p className="text-sm md:text-base">{community.regional}</p>}
              />

              <div className="flex flex-wrap items-center justify-center gap-4 text-base md:text-lg font-semibold">
                <BilingualText
                  english={<span className="text-primary">{noMiddleman.en}</span>}
                  regional={<span className="text-sm">{noMiddleman.regional}</span>}
                  containerClassName="text-center"
                />
                <span className="text-muted-foreground">•</span>
                <BilingualText
                  english={<span className="text-primary">{noCommission.en}</span>}
                  regional={<span className="text-sm">{noCommission.regional}</span>}
                  containerClassName="text-center"
                />
              </div>

              <div className="pt-4">
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full font-medium transition-colors shadow-sm"
                >
                  <SiWhatsapp className="h-5 w-5" />
                  <BilingualText
                    english={<span>{contactWA.en}</span>}
                    regional={<span className="text-sm">{contactWA.regional}</span>}
                    containerClassName="flex flex-col items-start"
                    regionalClassName="text-xs opacity-90"
                  />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
              <span>© {currentYear} {appName.en}. All rights reserved.</span>
              <span className="hidden sm:inline">•</span>
              <span className="flex items-center gap-1.5">
                Built with <Heart className="w-4 h-4 text-primary fill-primary" /> using{' '}
                <a
                  href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:opacity-80 transition-opacity underline"
                >
                  caffeine.ai
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
