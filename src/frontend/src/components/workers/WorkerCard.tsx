import { useMemo } from 'react';
import { Phone, MessageCircle, MapPin, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Worker } from '@/backend';
import { logError } from '@/utils/errors';
import { calculateDistance, formatDistance, type Coordinates } from '@/utils/workerDistance';
import SafeIconImage from '@/components/common/SafeIconImage';
import { useI18n } from '@/components/i18n/I18nProvider';

interface WorkerCardProps {
  worker: Worker;
  userLocation?: Coordinates | null;
}

export default function WorkerCard({ worker, userLocation }: WorkerCardProps) {
  const { t } = useI18n();
  
  // Safe field access with fallbacks
  const name = worker?.name || 'Unknown';
  const phone = worker?.phone || '';
  const area = worker?.area || 'Not specified';
  const skills = Array.isArray(worker?.skills) ? worker.skills : [];
  const verified = worker?.verified || false;
  const category = worker?.category || '';
  const subcategory = worker?.subcategory || '';

  // Safe photo URL access
  let photoUrl = '';
  try {
    if (worker?.photo && typeof worker.photo.getDirectURL === 'function') {
      photoUrl = worker.photo.getDirectURL();
    }
  } catch (error) {
    logError('WorkerCard.photoUrl', error);
  }

  // Calculate distance if both user and worker locations are available
  const distance = useMemo(() => {
    if (!userLocation || !worker?.location) return null;
    
    try {
      const workerCoords: Coordinates = {
        latitude: worker.location.lat,
        longitude: worker.location.lon,
      };
      const distanceKm = calculateDistance(userLocation, workerCoords);
      return formatDistance(distanceKm);
    } catch (error) {
      logError('WorkerCard.distance', error);
      return null;
    }
  }, [userLocation, worker?.location]);

  // Derive main skill (first skill, or subcategory, or category)
  const mainSkill = useMemo(() => {
    if (skills.length > 0) {
      return skills[0];
    }
    if (subcategory) {
      return subcategory;
    }
    if (category) {
      return category;
    }
    return 'Worker';
  }, [skills, subcategory, category]);

  // Other skills (remaining skills after main)
  const otherSkills = useMemo(() => {
    if (skills.length > 1) {
      return skills.slice(1);
    }
    return [];
  }, [skills]);

  // Resolve availability status
  const availability = useMemo(() => {
    // For now, default to "Call to confirm" since backend doesn't have availability field yet
    // In future, this would check worker.availability field
    return 'callToConfirm';
  }, []);

  // Check if recently active (within last 7 days)
  const isRecentlyActive = useMemo(() => {
    if (!worker?.lastActive) return false;
    
    try {
      const lastActiveMs = Number(worker.lastActive) / 1_000_000; // Convert nanoseconds to milliseconds
      const now = Date.now();
      const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
      return (now - lastActiveMs) < sevenDaysMs;
    } catch {
      return false;
    }
  }, [worker?.lastActive]);

  // Safe action handlers
  const handleCall = () => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (phone) {
      // Remove any non-digit characters from phone number
      const cleanPhone = phone.replace(/\D/g, '');
      window.open(`https://wa.me/${cleanPhone}`, '_blank', 'noopener,noreferrer');
    }
  };

  const hasPhone = !!phone;

  // Get translations
  const availabilityText = t(`worker.availability.${availability}`);
  const verifiedText = t('worker.trust.verified');
  const recentlyActiveText = t('worker.trust.recentlyActive');
  const whatsappText = t('worker.action.whatsapp');
  const callText = t('worker.action.call');

  return (
    <Card className="overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        {photoUrl ? (
          <SafeIconImage
            src={photoUrl}
            alt={name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <span className="text-4xl text-muted-foreground">👤</span>
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        {/* 1. Worker Name (large bold) */}
        <div>
          <h3 className="text-2xl font-bold text-foreground leading-tight">{name}</h3>
        </div>

        {/* 2. Main skill (highlight color) */}
        <div>
          <Badge className="text-base px-4 py-1.5 bg-primary text-primary-foreground font-semibold">
            {mainSkill}
          </Badge>
        </div>

        {/* 3. Other skills as small tag badges */}
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
          {distance && (
            <span className="text-xs text-muted-foreground">• {distance}</span>
          )}
        </div>

        {/* 5. Availability */}
        <div className="text-sm">
          <span className="text-muted-foreground">
            {availabilityText.en}
          </span>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap gap-2 items-center text-xs">
          {verified && (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-3.5 w-3.5" />
              <span className="font-medium">{verifiedText.en}</span>
            </div>
          )}
          {isRecentlyActive && (
            <div className="flex items-center gap-1 text-blue-600">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">{recentlyActiveText.en}</span>
            </div>
          )}
        </div>

        {/* ACTIONS: WhatsApp primary (green large), Call secondary (outline) */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={handleWhatsApp}
            size="lg"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            disabled={!hasPhone}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {whatsappText.en}
          </Button>
          <Button
            onClick={handleCall}
            size="lg"
            variant="outline"
            className="w-full border-2 font-semibold"
            disabled={!hasPhone}
          >
            <Phone className="mr-2 h-5 w-5" />
            {callText.en}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
