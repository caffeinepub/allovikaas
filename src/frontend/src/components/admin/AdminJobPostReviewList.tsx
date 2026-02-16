import { Card, CardContent } from '@/components/ui/card';

export default function AdminJobPostReviewList() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Job Posts</h2>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-lg text-muted-foreground">
            Job posting feature is not yet available
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This feature will be added in a future update
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
