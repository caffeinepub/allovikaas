import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, CheckCircle2 } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';
import { Worker } from '@/backend';
import { useI18n } from '../i18n/I18nProvider';
import BilingualText from '../i18n/BilingualText';

interface WorkerCardProps {
  worker: Worker;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  const { t } = useI18n();
  const callLabel = t('worker.call');
  const whatsappLabel = t('worker.whatsapp');
  const verifiedLabel = t('worker.verified');
  const experienceLabel = t('worker.experience');
  const availabilityLabel = t('worker.availability');

  const photoUrl = worker.photo.getDirectURL();
  const phoneNumber = worker.phone.replace(/\D/g, '');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 border-2 border-border">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row gap-4 p-6">
          {/* Photo */}
          <div className="flex-shrink-0">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-muted">
              <img
                src={photoUrl}
                alt={`Photo of ${worker.name}`}
                className="w-full h-full object-cover"
              />
              {worker.verified && (
                <div className="absolute top-1 right-1 bg-primary rounded-full p-1">
                  <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-xl font-bold text-foreground">{worker.name}</h3>
                <p className="text-base text-muted-foreground mt-0.5">{worker.category}</p>
                {worker.subcategory && (
                  <p className="text-sm text-muted-foreground">{worker.subcategory}</p>
                )}
              </div>
              {worker.verified && (
                <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  <BilingualText
                    english={<span className="text-xs">{verifiedLabel.en}</span>}
                    regional={<span className="text-xs">{verifiedLabel.regional}</span>}
                    containerClassName="flex flex-col"
                    regionalClassName="text-xs opacity-80"
                  />
                </Badge>
              )}
            </div>

            <div className="space-y-1 text-sm">
              <p className="text-foreground">
                <span className="font-medium">Area:</span> {worker.area}
              </p>
              {worker.experience && (
                <BilingualText
                  english={
                    <p className="text-foreground">
                      <span className="font-medium">{experienceLabel.en}:</span> {worker.experience}
                    </p>
                  }
                  regional={
                    <p className="text-muted-foreground text-xs">
                      {experienceLabel.regional}: {worker.experience}
                    </p>
                  }
                  regionalClassName="text-xs opacity-80"
                />
              )}
              {worker.workingHours && (
                <BilingualText
                  english={
                    <p className="text-foreground">
                      <span className="font-medium">{availabilityLabel.en}:</span> {worker.workingHours}
                    </p>
                  }
                  regional={
                    <p className="text-muted-foreground text-xs">
                      {availabilityLabel.regional}: {worker.workingHours}
                    </p>
                  }
                  regionalClassName="text-xs opacity-80"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <a href={`tel:${phoneNumber}`} className="flex-1 min-w-[120px]">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  <BilingualText
                    english={<span>{callLabel.en}</span>}
                    regional={<span className="text-xs">{callLabel.regional}</span>}
                    containerClassName="flex flex-col items-start"
                    regionalClassName="text-xs opacity-90"
                  />
                </Button>
              </a>
              <a
                href={`https://wa.me/${phoneNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-[120px]"
              >
                <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white">
                  <SiWhatsapp className="h-4 w-4 mr-2" />
                  <BilingualText
                    english={<span>{whatsappLabel.en}</span>}
                    regional={<span className="text-xs">{whatsappLabel.regional}</span>}
                    containerClassName="flex flex-col items-start"
                    regionalClassName="text-xs opacity-90"
                  />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
