import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useAdminWorkerMutations() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const approveWorker = useMutation({
    mutationFn: async (workerId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveWorker(workerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-workers'] });
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker-search'] });
    },
  });

  const rejectWorker = useMutation({
    mutationFn: async ({ workerId, reason }: { workerId: bigint; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectWorker(workerId, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-workers'] });
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
    },
  });

  const markVerified = useMutation({
    mutationFn: async (workerId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markWorkerVerified(workerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker-search'] });
    },
  });

  const featureWorker = useMutation({
    mutationFn: async (workerId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.featureWorker(workerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker-search'] });
    },
  });

  const unfeatureWorker = useMutation({
    mutationFn: async (workerId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unfeatureWorker(workerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-workers'] });
      queryClient.invalidateQueries({ queryKey: ['worker-search'] });
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
      if (!actor) throw new Error('Actor not available');
      return actor.approveJobPost(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['all-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['approved-jobs'] });
    },
  });

  const rejectJob = useMutation({
    mutationFn: async (jobId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectJobPost(jobId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['all-jobs'] });
    },
  });

  return {
    approveJob,
    rejectJob,
  };
}
