import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, Loader2, Star } from 'lucide-react';
import { useGetPendingWorkers, useGetAllWorkers } from '@/hooks/useQueries';
import { useAdminWorkerMutations } from '@/hooks/useAdminMutations';
import { Worker } from '@/backend';
import { useState } from 'react';

export default function AdminWorkerReviewList() {
  const { data: pendingWorkers, isLoading: loadingPending } = useGetPendingWorkers();
  const { data: allWorkers, isLoading: loadingAll } = useGetAllWorkers();
  const { approveWorker, rejectWorker, markVerified, featureWorker, unfeatureWorker } = useAdminWorkerMutations();
  const [showAll, setShowAll] = useState(false);

  const workers = showAll ? allWorkers : pendingWorkers;
  const isLoading = showAll ? loadingAll : loadingPending;

  const handleApprove = async (workerId: bigint) => {
    try {
      await approveWorker.mutateAsync(workerId);
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const handleReject = async (workerId: bigint) => {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      try {
        await rejectWorker.mutateAsync({ workerId, reason });
      } catch (err) {
        console.error('Reject error:', err);
      }
    }
  };

  const handleToggleVerified = async (worker: Worker) => {
    if (!worker.verified) {
      try {
        await markVerified.mutateAsync(worker.id);
      } catch (err) {
        console.error('Mark verified error:', err);
      }
    }
  };

  const handleToggleFeatured = async (worker: Worker) => {
    try {
      if (worker.featured) {
        await unfeatureWorker.mutateAsync(worker.id);
      } else {
        await featureWorker.mutateAsync(worker.id);
      }
    } catch (err) {
      console.error('Toggle featured error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          {showAll ? 'All Workers' : 'Pending Worker Registrations'}
        </h2>
        <Button variant="outline" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Pending Only' : 'Show All Workers'}
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && workers && workers.length === 0 && (
        <div className="bg-muted/50 rounded-xl p-12 text-center">
          <p className="text-lg text-muted-foreground">
            {showAll ? 'No workers found.' : 'No pending worker registrations.'}
          </p>
        </div>
      )}

      {!isLoading && workers && workers.length > 0 && (
        <div className="space-y-4">
          {workers.map((worker) => (
            <Card key={Number(worker.id)} className="border-2 border-border">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{worker.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {worker.category} - {worker.subcategory}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {worker.status.__kind__ === 'pendingVerification' && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                        Pending
                      </Badge>
                    )}
                    {worker.status.__kind__ === 'approved' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                        Approved
                      </Badge>
                    )}
                    {worker.status.__kind__ === 'rejected' && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                        Rejected
                      </Badge>
                    )}
                    {worker.verified && (
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    {worker.featured && (
                      <Badge className="bg-amber-50 text-amber-700 border-amber-300">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <p>
                    <span className="font-medium">Phone:</span> {worker.phone}
                  </p>
                  <p>
                    <span className="font-medium">Area:</span> {worker.area}
                  </p>
                  <p>
                    <span className="font-medium">Experience:</span> {worker.experience}
                  </p>
                  <p>
                    <span className="font-medium">Working Hours:</span> {worker.workingHours}
                  </p>
                </div>

                {worker.comments && (
                  <p className="text-sm">
                    <span className="font-medium">Comments:</span> {worker.comments}
                  </p>
                )}

                <div className="flex items-center justify-center">
                  <img
                    src={worker.photo.getDirectURL()}
                    alt={worker.name}
                    className="w-32 h-32 object-cover rounded-xl border-2 border-border"
                  />
                </div>

                {worker.status.__kind__ === 'pendingVerification' && (
                  <div className="flex gap-3 pt-4 border-t border-border">
                    <Button
                      onClick={() => handleApprove(worker.id)}
                      disabled={approveWorker.isPending}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      {approveWorker.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(worker.id)}
                      disabled={rejectWorker.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      {rejectWorker.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject
                    </Button>
                  </div>
                )}

                {worker.status.__kind__ === 'approved' && (
                  <div className="flex flex-col gap-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`verified-${worker.id}`} className="text-base">
                        Mark as Verified
                      </Label>
                      <Switch
                        id={`verified-${worker.id}`}
                        checked={worker.verified}
                        onCheckedChange={() => handleToggleVerified(worker)}
                        disabled={worker.verified || markVerified.isPending}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`featured-${worker.id}`} className="text-base">
                        Feature Worker
                      </Label>
                      <Switch
                        id={`featured-${worker.id}`}
                        checked={worker.featured}
                        onCheckedChange={() => handleToggleFeatured(worker)}
                        disabled={featureWorker.isPending || unfeatureWorker.isPending}
                      />
                    </div>
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
