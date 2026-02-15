import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle2 } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Worker } from '@/backend';
import { useI18n } from '../i18n/I18nProvider';
import BilingualText from '../i18n/BilingualText';
import { getBilingualSubcategoryLabel } from '@/utils/bilingualTaxonomy';

interface WorkerCardProps {
  worker: Worker;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const { t } = useI18n();
  
  // Safe field access with fallbacks
  const name = worker?.name || 'Unknown';
  const category = worker?.category || 'General';
  const subcategory = worker?.subcategory || '';
  const area = worker?.area || 'Not specified';
  const experience = worker?.experience || 'Not specified';
  const workingHours = worker?.workingHours || 'Not specified';
  const phone = worker?.phone || '';
  const verified = worker?.verified || false;
  const comments = worker?.comments || null;

  // Safe photo URL access
  let photoUrl = '/assets/generated/icon-fallback.dim_128x128.svg';
  try {
    if (worker?.photo && typeof worker.photo.getDirectURL === 'function') {
      photoUrl = worker.photo.getDirectURL();
    }
  } catch (error) {
    console.error('Error getting photo URL:', error);
  }

  // Safe phone number extraction
  const phoneNumber = phone.replace(/\D/g, '');

  // Get translations
  const callText = t('worker.call');
  const whatsappText = t('worker.whatsapp');
  const verifiedText = t('worker.verified');
  const experienceText = t('worker.experience');
  const availabilityText = t('worker.availability');

  // Get bilingual subcategory label
  const subLabel = subcategory ? getBilingualSubcategoryLabel(subcategory, t) : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 border-2 border-border">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-6">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-muted">
              <img
                src={photoUrl}
                alt={`Photo of ${name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/generated/icon-fallback.dim_128x128.svg';
                }}
              />
              {verified && (
                <div className="absolute top-1 right-1 bg-primary rounded-full p-1">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-foreground truncate">{name}</h3>
              {subLabel ? (
                <BilingualText
                  english={<p className="text-sm text-muted-foreground">{subLabel.en}</p>}
                  regional={<p className="text-xs text-muted-foreground">{subLabel.regional}</p>}
                  regionalClassName="text-xs text-muted-foreground mt-0.5"
                />
              ) : (
                <p className="text-sm text-muted-foreground">{category}</p>
              )}
              <p className="text-sm text-muted-foreground mt-1">📍 {area}</p>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex items-start gap-2">
                <BilingualText
                  english={<span className="text-muted-foreground min-w-[80px]">{experienceText.en}:</span>}
                  regional={<span className="text-xs text-muted-foreground min-w-[80px]">{experienceText.regional}:</span>}
                  regionalClassName="text-xs text-muted-foreground"
                />
                <span className="text-foreground font-medium">{experience}</span>
              </div>
              <div className="flex items-start gap-2">
                <BilingualText
                  english={<span className="text-muted-foreground min-w-[80px]">{availabilityText.en}:</span>}
                  regional={<span className="text-xs text-muted-foreground min-w-[80px]">{availabilityText.regional}:</span>}
                  regionalClassName="text-xs text-muted-foreground"
                />
                <span className="text-foreground font-medium">{workingHours}</span>
              </div>
            </div>

            {comments && (
              <p className="text-xs text-muted-foreground italic line-clamp-2">
                {comments}
              </p>
            )}

            {verified && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                <BilingualText
                  english={<span>{verifiedText.en}</span>}
                  regional={<span className="text-xs">{verifiedText.regional}</span>}
                  regionalClassName="text-xs"
                />
              </Badge>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        {phoneNumber && (
          <div className="border-t border-border p-4 flex gap-2">
            <Button
              asChild
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="sm"
            >
              <a href={`tel:${phoneNumber}`}>
                <Phone className="h-4 w-4 mr-2" />
                <BilingualText
                  english={<span>{callText.en}</span>}
                  regional={<span className="text-xs">{callText.regional}</span>}
                  regionalClassName="text-xs"
                />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
              size="sm"
            >
              <a
                href={`https://wa.me/${phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiWhatsapp className="h-4 w-4 mr-2" />
                <BilingualText
                  english={<span>{whatsappText.en}</span>}
                  regional={<span className="text-xs">{whatsappText.regional}</span>}
                  regionalClassName="text-xs"
                />
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
