import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Phone, MessageCircle, MapPin, Clock, Briefcase, Languages, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PageShell from '@/components/layout/PageShell';
import SafeIconImage from '@/components/common/SafeIconImage';
import BilingualText from '@/components/i18n/BilingualText';
import { useI18n } from '@/components/i18n/I18nProvider';
import { useGetWorkerById } from '@/hooks/useQueries';
import { buildWhatsAppURL, buildPhoneURL } from '@/utils/workerContactLinks';
import { logError } from '@/utils/errors';
import { formatTaxonomyLabel } from '@/utils/formatTaxonomyLabel';

export default function WorkerProfilePage() {
  const { id } = useParams({ from: '/worker/$id' });
  const navigate = useNavigate();
  const { t } = useI18n();

  // Parse worker ID
  const workerId = id ? BigInt(id) : BigInt(0);

  // Fetch worker data
  const { data: worker, isLoading, error } = useGetWorkerById(workerId);

  // Get translations
  const nameLabel = t('worker.profile.name');
  const workLabel = t('worker.profile.work');
  const areaLabel = t('worker.profile.area');
  const experienceLabel = t('worker.profile.experience');
  const workDescriptionLabel = t('worker.profile.workDescription');
  const availableTimeLabel = t('worker.profile.availableTime');
  const languagesLabel = t('worker.profile.languages');
  const callText = t('worker.action.call');
  const whatsappText = t('worker.action.whatsapp');
  const loadingText = t('worker.profile.loading');
  const notFoundText = t('worker.profile.notFound');
  const verifiedText = t('worker.trust.verified');

  // Loading state
  if (isLoading) {
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-lg text-muted-foreground">
                <BilingualText
                  english={loadingText.en}
                  regional={loadingText.regional}
                  englishClassName="text-base"
                  regionalClassName="text-sm text-muted-foreground"
                />
              </p>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  // Not found state
  if (!worker || error) {
    return (
      <PageShell>
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
            <div className="text-center space-y-4">
              <p className="text-xl text-muted-foreground">
                <BilingualText
                  english={notFoundText.en}
                  regional={notFoundText.regional}
                  englishClassName="text-lg font-medium"
                  regionalClassName="text-base text-muted-foreground"
                />
              </p>
            </div>
            <Button
              onClick={() => navigate({ to: '/search' })}
              variant="default"
              size="lg"
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Search
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  // Safe field access with fallbacks
  const name = worker.name || 'Unknown';
  const phone = worker.phone || '';
  const area = worker.area || 'Not specified';
  const category = worker.category || '';
  const subcategory = worker.subcategory || '';
  const experience = worker.experience || 'Not specified';
  const workingHours = worker.workingHours || 'Not specified';
  const skills = Array.isArray(worker.skills) ? worker.skills : [];
  const verified = worker.verified || false;

  // Safe photo URL access
  let photoUrl = '';
  try {
    if (worker.photo && typeof worker.photo.getDirectURL === 'function') {
      photoUrl = worker.photo.getDirectURL();
    }
  } catch (error) {
    logError('WorkerProfilePage.photoUrl', error);
  }

  // Build contact context
  const contactContext = {
    category,
    subcategory,
    area,
  };

  // Action handlers
  const handleCall = () => {
    if (phone) {
      window.location.href = buildPhoneURL(phone);
    }
  };

  const handleWhatsApp = () => {
    if (phone) {
      const whatsappURL = buildWhatsAppURL(phone, contactContext);
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    }
  };

  const hasPhone = !!phone;

  // Derive work type display - formatted
  const workType = formatTaxonomyLabel(subcategory || category || 'Worker');

  // Derive work description from skills - formatted
  const workDescription = skills.length > 0 
    ? skills.map(skill => formatTaxonomyLabel(skill)).join(', ') 
    : 'No description available';

  // Languages (default to Tamil and English for now)
  const languages = 'Tamil, English';

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto space-y-6 pb-32">
        {/* Back button */}
        <Button
          onClick={() => navigate({ to: '/search' })}
          variant="ghost"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Profile Header Card */}
        <Card className="overflow-hidden rounded-2xl shadow-lg">
          <div className="relative">
            {photoUrl ? (
              <SafeIconImage
                src={photoUrl}
                alt={name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 bg-muted flex items-center justify-center">
                <span className="text-6xl text-muted-foreground">👤</span>
              </div>
            )}
          </div>

          <CardHeader className="space-y-4 pb-4">
            {/* Name */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <BilingualText
                  english={nameLabel.en}
                  regional={nameLabel.regional}
                  englishClassName="inline"
                  regionalClassName="inline ml-2"
                />
              </p>
              <h1 className="text-3xl font-bold text-foreground">{name}</h1>
              {verified && (
                <div className="flex items-center gap-1.5 text-green-600 mt-2">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">{verifiedText.en}</span>
                </div>
              )}
            </div>

            {/* Work Type - formatted */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <BilingualText
                  english={workLabel.en}
                  regional={workLabel.regional}
                  englishClassName="inline"
                  regionalClassName="inline ml-2"
                />
              </p>
              <Badge className="text-base px-4 py-1.5 bg-primary text-primary-foreground font-semibold">
                {workType}
              </Badge>
            </div>

            {/* Area */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                <BilingualText
                  english={areaLabel.en}
                  regional={areaLabel.regional}
                  englishClassName="inline"
                  regionalClassName="inline ml-2"
                />
              </p>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-lg font-medium text-foreground">{area}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Details Card */}
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-6 space-y-6">
            {/* Experience */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  <BilingualText
                    english={experienceLabel.en}
                    regional={experienceLabel.regional}
                    englishClassName="inline"
                    regionalClassName="inline ml-2"
                  />
                </p>
              </div>
              <p className="text-base text-foreground ml-7">{experience}</p>
            </div>

            {/* Work Description - formatted */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  <BilingualText
                    english={workDescriptionLabel.en}
                    regional={workDescriptionLabel.regional}
                    englishClassName="inline"
                    regionalClassName="inline ml-2"
                  />
                </p>
              </div>
              <p className="text-base text-foreground ml-7">{workDescription}</p>
            </div>

            {/* Available Time */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  <BilingualText
                    english={availableTimeLabel.en}
                    regional={availableTimeLabel.regional}
                    englishClassName="inline"
                    regionalClassName="inline ml-2"
                  />
                </p>
              </div>
              <p className="text-base text-foreground ml-7">{workingHours}</p>
            </div>

            {/* Languages */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-muted-foreground" />
                <p className="text-sm font-semibold text-foreground uppercase tracking-wide">
                  <BilingualText
                    english={languagesLabel.en}
                    regional={languagesLabel.regional}
                    englishClassName="inline"
                    regionalClassName="inline ml-2"
                  />
                </p>
              </div>
              <p className="text-base text-foreground ml-7">{languages}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sticky Bottom Action Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-50">
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
            {/* Call button */}
            <Button
              onClick={handleCall}
              size="lg"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-full text-base py-6 flex items-center justify-center gap-2"
              disabled={!hasPhone}
            >
              <Phone className="h-5 w-5" />
              <BilingualText 
                english={callText.en} 
                regional={callText.regional} 
                containerClassName="text-center"
                englishClassName="text-sm leading-tight" 
                regionalClassName="text-xs leading-tight"
              />
            </Button>

            {/* WhatsApp button */}
            <Button
              onClick={handleWhatsApp}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full text-base py-6 flex items-center justify-center gap-2"
              disabled={!hasPhone}
            >
              <MessageCircle className="h-5 w-5" />
              <BilingualText 
                english={whatsappText.en} 
                regional={whatsappText.regional} 
                containerClassName="text-center"
                englishClassName="text-sm leading-tight" 
                regionalClassName="text-xs leading-tight"
              />
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
