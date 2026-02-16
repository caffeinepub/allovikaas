import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Worker } from '@/backend';
import { useI18n } from '@/components/i18n/I18nProvider';
import BilingualText from '@/components/i18n/BilingualText';
import { buildWhatsAppURL, buildPhoneURL } from '@/utils/workerContactLinks';
import { formatTaxonomyLabel } from '@/utils/formatTaxonomyLabel';

interface WorkerCardProps {
  worker: Worker;
  searchContext?: {
    category?: string;
    area?: string;
  };
}

export default function WorkerCard({ worker, searchContext }: WorkerCardProps) {
  const { t } = useI18n();
  const navigate = useNavigate();
  
  const name = worker?.name || 'Unknown';
  const phone = worker?.phone || '';
  const area = worker?.area || 'Not specified';
  const skills = Array.isArray(worker?.skills) ? worker.skills : [];
  const category = worker?.category || '';
  const workerId = worker?.id;

  // Derive main skill (first skill, or category) - formatted
  const mainSkill = useMemo(() => {
    if (skills.length > 0) {
      return formatTaxonomyLabel(skills[0]);
    }
    if (category) {
      return formatTaxonomyLabel(category);
    }
    return 'Worker';
  }, [skills, category]);

  // Other skills (remaining skills after main) - formatted
  const otherSkills = useMemo(() => {
    if (skills.length > 1) {
      return skills.slice(1).map(skill => formatTaxonomyLabel(skill));
    }
    return [];
  }, [skills]);

  // Build contact context for prefills
  const contactContext = useMemo(() => {
    return {
      category: searchContext?.category || category,
      area: searchContext?.area || area,
    };
  }, [searchContext, category, area]);

  // Safe action handlers
  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phone) {
      window.location.href = buildPhoneURL(phone);
    }
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (phone) {
      const whatsappURL = buildWhatsAppURL(phone, contactContext);
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCardClick = () => {
    if (workerId !== undefined) {
      navigate({ to: '/worker/$id', params: { id: String(workerId) } });
    }
  };

  const hasPhone = !!phone;

  // Get translations
  const availabilityText = t('worker.availability.callToConfirm');
  const whatsappText = t('worker.action.whatsapp');
  const callText = t('worker.action.call');

  return (
    <Card 
      className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="w-full h-48 bg-muted flex items-center justify-center">
          <span className="text-4xl text-muted-foreground">👤</span>
        </div>
      </div>

      <CardContent className="p-5 space-y-3 flex-1 flex flex-col">
        {/* 1. Worker Name (large bold) */}
        <div>
          <h3 className="text-2xl font-bold text-foreground leading-tight">{name}</h3>
        </div>

        {/* 2. Main skill (highlight color) - formatted */}
        <div>
          <Badge className="text-base px-4 py-1.5 bg-primary text-primary-foreground font-semibold">
            {mainSkill}
          </Badge>
        </div>

        {/* 3. Other skills as small tag badges - formatted */}
        {otherSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {otherSkills.map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground"
              >
                #{skill}
              </Badge>
            ))}
          </div>
        )}

        {/* 4. Area location */}
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span className="font-medium text-foreground">{area}</span>
        </div>

        {/* 5. Availability */}
        <div className="text-sm">
          <span className="text-muted-foreground">
            {availabilityText.en}
          </span>
        </div>

        {/* Spacer to push buttons to bottom */}
        <div className="flex-1" />

        {/* Action buttons */}
        {hasPhone && (
          <div className="flex gap-2 pt-3 border-t border-border">
            <Button
              onClick={handleWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <MessageCircle className="h-4 w-4 mr-1.5" />
              <BilingualText
                english={<span className="text-sm">{whatsappText.en}</span>}
                regional={<span className="text-xs">{whatsappText.regional}</span>}
                containerClassName="flex flex-col leading-tight"
                regionalClassName="text-xs"
              />
            </Button>
            <Button
              onClick={handleCall}
              variant="outline"
              className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              size="sm"
            >
              <Phone className="h-4 w-4 mr-1.5" />
              <BilingualText
                english={<span className="text-sm">{callText.en}</span>}
                regional={<span className="text-xs">{callText.regional}</span>}
                containerClassName="flex flex-col leading-tight"
                regionalClassName="text-xs"
              />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
