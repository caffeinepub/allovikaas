import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useGetPendingJobPosts, useGetAllJobPosts } from '@/hooks/useQueries';
import { useAdminJobMutations } from '@/hooks/useAdminMutations';
import { useState } from 'react';

export default function AdminJobPostReviewList() {
  const { data: pendingJobs, isLoading: loadingPending } = useGetPendingJobPosts();
  const { data: allJobs, isLoading: loadingAll } = useGetAllJobPosts();
  const { approveJob, rejectJob } = useAdminJobMutations();
  const [showAll, setShowAll] = useState(false);

  const jobs = showAll ? allJobs : pendingJobs;
  const isLoading = showAll ? loadingAll : loadingPending;

  const handleApprove = async (jobId: bigint) => {
    try {
      await approveJob.mutateAsync(jobId);
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const handleReject = async (jobId: bigint) => {
    try {
      await rejectJob.mutateAsync(jobId);
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {showAll ? 'All Job Posts' : 'Pending Job Posts'}
        </h2>
        <Button variant="outline" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Pending Only' : 'Show All Jobs'}
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && jobs && jobs.length === 0 && (
        <div className="bg-muted/50 rounded-xl p-12 text-center">
          <p className="text-lg text-muted-foreground">
            {showAll ? 'No job posts found.' : 'No pending job posts.'}
          </p>
        </div>
      )}

      {!isLoading && jobs && jobs.length > 0 && (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={Number(job.id)} className="border-2 border-border">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-xl">{job.workType}</CardTitle>
                  <div>
                    {job.status === 'pending' && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Pending
                      </Badge>
                    )}
                    {job.status === 'approved' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        Approved
                      </Badge>
                    )}
                    {job.status === 'rejected' && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                        Rejected
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <p>
                    <span className="font-medium">Area:</span> {job.area}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {job.phone}
                  </p>
                  <p>
                    <span className="font-medium">Salary:</span> {job.salary}
                  </p>
                  <p>
                    <span className="font-medium">Date/Time:</span>{' '}
                    {new Date(Number(job.dateTime) / 1000000).toLocaleString()}
                  </p>
                </div>

                {job.description && (
                  <p className="text-sm">
                    <span className="font-medium">Description:</span> {job.description}
                  </p>
                )}

                {job.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      onClick={() => handleApprove(job.id)}
                      disabled={approveJob.isPending}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {approveJob.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(job.id)}
                      disabled={rejectJob.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      {rejectJob.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
