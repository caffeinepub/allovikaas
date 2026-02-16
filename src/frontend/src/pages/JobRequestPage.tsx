import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PageShell from '@/components/layout/PageShell';
import { ArrowLeft } from 'lucide-react';

export default function JobRequestPage() {
  const navigate = useNavigate();

  return (
    <PageShell variant="compact">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Button
          onClick={() => navigate({ to: '/' })}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Post a Job
          </h1>
          <p className="text-lg text-muted-foreground">
            வேலை இடுகை
          </p>
        </div>

        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg text-muted-foreground">
              Job posting feature is not yet available
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              This feature will be added in a future update
            </p>
            <Button
              onClick={() => navigate({ to: '/' })}
              className="mt-6"
            >
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
