import { Worker } from '@/backend';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { formatTaxonomyLabel } from '@/utils/formatTaxonomyLabel';
import { buildWhatsAppURL, buildPhoneURL } from '@/utils/workerContactLinks';

interface HomeWorkerResultsPreviewProps {
  matches: Worker[];
  query: string;
  isLoading: boolean;
}

export default function HomeWorkerResultsPreview({
  matches,
  query,
  isLoading,
}: HomeWorkerResultsPreviewProps) {
  const navigate = useNavigate();

  // Don't show anything if query is empty
  if (!query.trim()) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-4 p-6 bg-background/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
        <p className="text-center text-muted-foreground">Searching...</p>
      </div>
    );
  }

  // No results state
  if (matches.length === 0) {
    return (
      <div className="mt-4 p-6 bg-background/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border">
        <p className="text-center text-muted-foreground">
          No workers found — try another word
        </p>
      </div>
    );
  }

  // Results preview
  return (
    <div className="mt-4 p-4 bg-background/95 backdrop-blur-sm rounded-2xl shadow-lg border border-border max-h-[500px] overflow-y-auto">
      <div className="space-y-3">
        {matches.map((worker) => {
          const mainSkill = worker.skills.length > 0
            ? formatTaxonomyLabel(worker.skills[0])
            : formatTaxonomyLabel(worker.category);

          const handleCardClick = () => {
            navigate({ to: '/worker/$id', params: { id: String(worker.id) } });
          };

          const handleWhatsApp = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (worker.phone) {
              const whatsappURL = buildWhatsAppURL(worker.phone, {
                category: worker.category,
                area: worker.area,
              });
              window.open(whatsappURL, '_blank', 'noopener,noreferrer');
            }
          };

          const handleCall = (e: React.MouseEvent) => {
            e.stopPropagation();
            if (worker.phone) {
              window.location.href = buildPhoneURL(worker.phone);
            }
          };

          return (
            <Card
              key={worker.id.toString()}
              className="cursor-pointer hover:shadow-md transition-shadow duration-200"
              onClick={handleCardClick}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">👤</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-lg text-foreground truncate">
                      {worker.name}
                    </h4>
                    <Badge className="mt-1 bg-primary text-primary-foreground text-xs">
                      {mainSkill}
                    </Badge>
                    <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">{worker.area}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={handleWhatsApp}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white h-8 w-8 p-0"
                    >
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={handleCall}
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground h-8 w-8 p-0"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
