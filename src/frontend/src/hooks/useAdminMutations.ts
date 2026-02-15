import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { logError } from '@/utils/errors';

export function useAdminWorkerMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const approveWorker = useMutation({
    mutationFn: async (workerId: bigint) => {
      if (!actor) {
        logError('approveWorker', 'Actor not available');
        return false;
      }
      try {
        const result = await actor.approveWorker(workerId);
        return result;
      } catch (error) {
        logError('approveWorker', error);
        return false;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-workers'] });
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker-search'] });
    },
    onError: (error) => {
      logError('approveWorker.onError', error);
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ['pending-workers'] });
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
    },
    onError: (error) => {
      logError('rejectWorker.onError', error);
    },
  });

  const markVerified = useMutation({
    mutationFn: async (workerId: bigint) => {
      if (!actor) {
        logError('markVerified', 'Actor not available');
        return;
      }
      try {
        await actor.markWorkerVerified(workerId);
      } catch (error) {
        logError('markVerified', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker-search'] });
    },
    onError: (error) => {
      logError('markVerified.onError', error);
    },
  });

  const featureWorker = useMutation({
    mutationFn: async (workerId: bigint) => {
      if (!actor) {
        logError('featureWorker', 'Actor not available');
        return;
      }
      try {
        await actor.featureWorker(workerId);
      } catch (error) {
        logError('featureWorker', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker-search'] });
    },
    onError: (error) => {
      logError('featureWorker.onError', error);
    },
  });

  const unfeatureWorker = useMutation({
    mutationFn: async (workerId: bigint) => {
      if (!actor) {
        logError('unfeatureWorker', 'Actor not available');
        return;
      }
      try {
        await actor.unfeatureWorker(workerId);
      } catch (error) {
        logError('unfeatureWorker', error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker-search'] });
    },
    onError: (error) => {
      logError('unfeatureWorker.onError', error);
    },
  });

  return {
    approveWorker,
    rejectWorker,
    markVerified,
    featureWorker,
    unfeatureWorker,
  };
}

export function useAdminJobMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const approveJob = useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) {
        logError('approveJob', 'Actor not available');
        return false;
      }
      try {
        const result = await actor.approveJobPost(jobId);
        return result;
      } catch (error) {
        logError('approveJob', error);
        return false;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['all-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['approved-jobs'] });
    },
    onError: (error) => {
      logError('approveJob.onError', error);
    },
  });

  const rejectJob = useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) {
        logError('rejectJob', 'Actor not available');
        return false;
      }
      try {
        const result = await actor.rejectJobPost(jobId);
        return result;
      } catch (error) {
        logError('rejectJob', error);
        return false;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['all-jobs'] });
    },
    onError: (error) => {
      logError('rejectJob.onError', error);
    },
  });

  return {
    approveJob,
    rejectJob,
  };
}
