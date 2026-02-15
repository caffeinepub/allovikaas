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
        return;
      }
      try {
        await actor.approveWorker(workerId);
      } catch (error) {
        logError('approveWorker', error);
        throw error;
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
        return;
      }
      try {
        await actor.rejectWorker(workerId, reason);
      } catch (error) {
        logError('rejectWorker', error);
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
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
        return;
      }
      try {
        await actor.approveJobPost(jobId);
      } catch (error) {
        logError('approveJob', error);
        throw error;
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
        return;
      }
      try {
        await actor.rejectJobPost(jobId);
      } catch (error) {
        logError('rejectJob', error);
        throw error;
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
