import { Card, CardContent } from '@/components/ui/card';

export default function JobBoard() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Job Board</h2>
        <p className="text-lg md:text-xl mt-1 opacity-80">வேலை பலகை</p>
      </div>

      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-lg text-muted-foreground">
            Job board feature is not yet available
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This feature will be added in a future update
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
