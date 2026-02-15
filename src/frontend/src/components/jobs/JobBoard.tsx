import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetApprovedJobs } from '@/hooks/useQueries';
import { useI18n } from '../i18n/I18nProvider';
import BilingualText from '../i18n/BilingualText';
import { Loader2 } from 'lucide-react';

export default function JobBoard() {
  const { data: jobs, isLoading } = useGetApprovedJobs();
  const { t } = useI18n();
  const boardTitle = t('job.board');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <BilingualText
          english={<h2 className="text-2xl md:text-3xl font-bold text-foreground">{boardTitle.en}</h2>}
          regional={<p className="text-lg md:text-xl mt-1">{boardTitle.regional}</p>}
          regionalClassName="text-lg md:text-xl mt-1 opacity-80"
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && jobs && jobs.length === 0 && (
        <div className="bg-muted/50 rounded-xl p-12 text-center">
          <p className="text-lg text-muted-foreground">No job posts available at the moment.</p>
        </div>
      )}

      {!isLoading && jobs && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={Number(job.id)} className="border-2 border-border hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">{job.workType}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1 text-sm">
                  <p className="text-foreground">
                    <span className="font-medium">Area:</span> {job.area}
                  </p>
                  <p className="text-foreground">
                    <span className="font-medium">Date/Time:</span> {new Date(Number(job.dateTime) / 1000000).toLocaleString()}
                  </p>
                  <p className="text-foreground">
                    <span className="font-medium">Salary:</span> {job.salary}
                  </p>
                  {job.description && (
                    <p className="text-foreground">
                      <span className="font-medium">Description:</span> {job.description}
                    </p>
                  )}
                </div>
                <a href={`tel:${job.phone}`} className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    Call: {job.phone}
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
