import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useGetPublicWorkers } from '@/hooks/useQueries';
import { useAdminWorkerMutations } from '@/hooks/useAdminMutations';
import { Worker } from '@/backend';
import { useState } from 'react';

export default function AdminWorkerReviewList() {
  const { data: allWorkers, isLoading } = useGetPublicWorkers();
  const { rejectWorker } = useAdminWorkerMutations();
  const [filter, setFilter] = useState<'all' | 'active' | 'rejected'>('all');

  // Filter workers by status
  const filteredWorkers = allWorkers?.filter(w => {
    if (filter === 'all') return true;
    if (filter === 'active') return w.status.__kind__ === 'active';
    if (filter === 'rejected') return w.status.__kind__ === 'rejected';
    return true;
  }) || [];

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">
          Worker Management
        </h2>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'} 
            onClick={() => setFilter('all')}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={filter === 'active' ? 'default' : 'outline'} 
            onClick={() => setFilter('active')}
            size="sm"
          >
            Active
          </Button>
          <Button 
            variant={filter === 'rejected' ? 'default' : 'outline'} 
            onClick={() => setFilter('rejected')}
            size="sm"
          >
            Rejected
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {!isLoading && filteredWorkers && filteredWorkers.length === 0 && (
        <div className="bg-muted/50 rounded-xl p-12 text-center">
          <p className="text-lg text-muted-foreground">
            No workers found.
          </p>
        </div>
      )}

      {!isLoading && filteredWorkers && filteredWorkers.length > 0 && (
        <div className="space-y-4">
          {filteredWorkers.map((worker) => {
            const name = worker?.name || 'Unknown';
            const category = worker?.category || 'General';
            const phone = worker?.phone || 'Not provided';
            const area = worker?.area || 'Not specified';
            const experience = worker?.experience || 'Not specified';
            const availableTime = worker?.availableTime || 'Not specified';
            const skills = Array.isArray(worker?.skills) ? worker.skills : [];
            const status = worker?.status || { __kind__: 'active' };

            return (
              <Card key={Number(worker.id)} className="border-2 border-border">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {category}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {status.__kind__ === 'active' && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Active
                        </Badge>
                      )}
                      {status.__kind__ === 'rejected' && (
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
                      <span className="font-medium">Phone:</span> {phone}
                    </p>
                    <p>
                      <span className="font-medium">Area:</span> {area}
                    </p>
                    <p>
                      <span className="font-medium">Experience:</span> {experience}
                    </p>
                    <p>
                      <span className="font-medium">Available Time:</span> {availableTime}
                    </p>
                  </div>

                  {skills.length > 0 && (
                    <div className="text-sm">
                      <span className="font-medium">Skills:</span> {skills.join(', ')}
                    </div>
                  )}

                  {status.__kind__ === 'rejected' && status.rejected && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm">
                      <span className="font-medium">Rejection Reason:</span> {status.rejected}
                    </div>
                  )}

                  {status.__kind__ === 'active' && (
                    <div className="flex gap-3 pt-4 border-t border-border">
                      <Button
                        onClick={() => handleReject(worker.id)}
                        disabled={rejectWorker.isPending}
                        variant="destructive"
                        className="flex-1"
                      >
                        {rejectWorker.isPending ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : null}
                        Reject Worker
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
