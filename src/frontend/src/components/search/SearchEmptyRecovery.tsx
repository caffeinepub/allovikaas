import { useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCategoryLabel } from '@/utils/categoryLabels';

interface SearchEmptyRecoveryProps {
  searchQuery?: string;
  category?: string;
  subcategory?: string;
  area?: string;
}

export default function SearchEmptyRecovery({
  searchQuery,
  category,
  subcategory,
  area,
}: SearchEmptyRecoveryProps) {
  const navigate = useNavigate();

  const handleTryAgain = () => {
    navigate({ to: '/search' });
  };

  return (
    <div className="space-y-8">
      <Card className="border-2 border-dashed border-border">
        <CardContent className="p-12 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-muted rounded-full p-6">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              No workers found
            </h3>
            <p className="text-muted-foreground">
              We couldn't find any workers matching your search criteria
            </p>
          </div>
          <div className="pt-4">
            <Button onClick={handleTryAgain} size="lg">
              Try a different search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search suggestions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Try searching for:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Construction', 'Agriculture', 'Home Services', 'Transport', 'Tailoring', 'Daily Helpers'].map((cat) => (
            <Button
              key={cat}
              variant="outline"
              onClick={() => navigate({ to: '/search', search: { category: cat } })}
              className="justify-start"
            >
              {getCategoryLabel(cat)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
