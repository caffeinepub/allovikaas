import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { logError } from '@/utils/errors';
import { PUBLIC_WORKERS_QUERY_KEY } from './useQueries';

export function useAdminWorkerMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const rejectWorker = useMutation({
    mutationFn: async ({ workerId, reason }: { workerId: bigint; reason: string }) => {
      if (!actor) {
        logError('rejectWorker', 'Actor not available');
        return false;
      }
      try {
        const result = await actor.rejectWorker(workerId, reason);
        return result;
      } catch (error) {
        logError('rejectWorker', error);
        return false;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PUBLIC_WORKERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['worker'] });
    },
    onError: (error) => {
      logError('rejectWorker.onError', error);
    },
  });

  return {
    rejectWorker,
  };
}
