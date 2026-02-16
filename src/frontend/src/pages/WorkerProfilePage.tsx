import { useParams, useNavigate } from '@tanstack/react-router';
import { Phone, MessageCircle, MapPin, ArrowLeft, Briefcase, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useGetWorkerById } from '@/hooks/useQueries';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import PageShell from '@/components/layout/PageShell';
import { buildWhatsAppURL, buildPhoneURL } from '@/utils/workerContactLinks';
import { formatTaxonomyLabel } from '@/utils/formatTaxonomyLabel';

export default function WorkerProfilePage() {
  const { id } = useParams({ from: '/worker/$id' });
  const navigate = useNavigate();
  const { t } = useI18n();
  
  const workerId = BigInt(id);
  const { data: worker, isLoading, error } = useGetWorkerById(workerId);

  if (isLoading) {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
              <p className="text-muted-foreground">Loading worker profile...</p>
            </div>
          </div>
        </div>
      </PageShell>
    );
  }

  if (error || !worker) {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-8 text-center">
            <p className="text-lg text-destructive font-medium">Worker not found</p>
            <Button
              onClick={() => navigate({ to: '/' })}
              variant="outline"
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  const name = worker.name || 'Unknown';
  const phone = worker.phone || '';
  const area = worker.area || 'Not specified';
  const category = worker.category || '';
  const experience = worker.experience || 'Not specified';
  const availableTime = worker.availableTime || 'Not specified';
  const skills = Array.isArray(worker.skills) ? worker.skills : [];

  // Format category for display
  const formattedCategory = formatTaxonomyLabel(category);

  // Build contact context
  const contactContext = {
    category,
    area,
  };

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

  const fieldName = t('worker.field.name');
  const fieldPhone = t('worker.field.phone');
  const fieldArea = t('worker.field.area');
  const fieldCategory = t('worker.field.category');
  const fieldExperience = t('worker.field.experience');
  const fieldSkills = t('worker.field.skills');
  const fieldAvailableTime = t('worker.field.availableTime');
  const whatsappText = t('worker.action.whatsapp');
  const callText = t('worker.action.call');

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="overflow-hidden rounded-2xl shadow-xl">
          <div className="relative">
            <div className="w-full h-64 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-8xl">👤</span>
            </div>
          </div>

          <CardContent className="p-6 md:p-8 space-y-6">
            {/* Name and Category */}
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">{name}</h1>
              <Badge className="text-lg px-4 py-1.5 bg-primary text-primary-foreground font-semibold">
                {formattedCategory}
              </Badge>
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="space-y-2">
                <BilingualText
                  english={<h3 className="text-lg font-semibold text-foreground">{fieldSkills.en}</h3>}
                  regional={<p className="text-base font-semibold text-foreground">{fieldSkills.regional}</p>}
                  regionalClassName="text-base font-semibold text-foreground mt-1"
                />
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-sm px-3 py-1 rounded-full"
                    >
                      #{formatTaxonomyLabel(skill)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <BilingualText
                    english={<p className="text-sm font-medium text-muted-foreground">{fieldArea.en}</p>}
                    regional={<p className="text-xs text-muted-foreground">{fieldArea.regional}</p>}
                    regionalClassName="text-xs text-muted-foreground"
                  />
                  <p className="text-base font-semibold text-foreground">{area}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <BilingualText
                    english={<p className="text-sm font-medium text-muted-foreground">{fieldExperience.en}</p>}
                    regional={<p className="text-xs text-muted-foreground">{fieldExperience.regional}</p>}
                    regionalClassName="text-xs text-muted-foreground"
                  />
                  <p className="text-base font-semibold text-foreground">{experience}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <BilingualText
                    english={<p className="text-sm font-medium text-muted-foreground">{fieldAvailableTime.en}</p>}
                    regional={<p className="text-xs text-muted-foreground">{fieldAvailableTime.regional}</p>}
                    regionalClassName="text-xs text-muted-foreground"
                  />
                  <p className="text-base font-semibold text-foreground">{availableTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <BilingualText
                    english={<p className="text-sm font-medium text-muted-foreground">{fieldPhone.en}</p>}
                    regional={<p className="text-xs text-muted-foreground">{fieldPhone.regional}</p>}
                    regionalClassName="text-xs text-muted-foreground"
                  />
                  <p className="text-base font-semibold text-foreground">{phone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sticky Bottom Action Bar */}
        {phone && (
          <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border shadow-lg p-4 z-40">
            <div className="max-w-4xl mx-auto flex gap-3">
              <Button
                onClick={handleWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 text-base"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                <BilingualText
                  english={<span>{whatsappText.en}</span>}
                  regional={<span className="text-sm">{whatsappText.regional}</span>}
                  containerClassName="flex flex-col leading-tight"
                  regionalClassName="text-sm"
                />
              </Button>
              <Button
                onClick={handleCall}
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground h-12 text-base"
              >
                <Phone className="h-5 w-5 mr-2" />
                <BilingualText
                  english={<span>{callText.en}</span>}
                  regional={<span className="text-sm">{callText.regional}</span>}
                  containerClassName="flex flex-col leading-tight"
                  regionalClassName="text-sm"
                />
              </Button>
            </div>
          </div>
        )}

        {/* Bottom spacer for sticky bar */}
        {phone && <div className="h-20" />}
      </div>
    </PageShell>
  );
}
