import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker, JobPost, UserProfile, Time } from '@/backend';
import { logError } from '@/utils/errors';

export function useGetApprovedJobs() {
  const { actor, isFetching } = useActor();

  return useQuery<JobPost[]>({
    queryKey: ['approved-jobs'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const jobs = await actor.getApprovedJobs();
        return Array.isArray(jobs) ? jobs : [];
      } catch (error) {
        logError('useGetApprovedJobs', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingWorkers() {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['pending-workers'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const workers = await actor.getPendingWorkers();
        return Array.isArray(workers) ? workers : [];
      } catch (error) {
        logError('useGetPendingWorkers', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllWorkers() {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: ['all-workers'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const workers = await actor.getAllWorkers();
        return Array.isArray(workers) ? workers : [];
      } catch (error) {
        logError('useGetAllWorkers', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingJobPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<JobPost[]>({
    queryKey: ['pending-jobs'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const jobs = await actor.getPendingJobPosts();
        return Array.isArray(jobs) ? jobs : [];
      } catch (error) {
        logError('useGetPendingJobPosts', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllJobPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<JobPost[]>({
    queryKey: ['all-jobs'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const jobs = await actor.getAllJobPosts();
        return Array.isArray(jobs) ? jobs : [];
      } catch (error) {
        logError('useGetAllJobPosts', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['is-admin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const result = await actor.isCallerAdmin();
        return typeof result === 'boolean' ? result : false;
      } catch (error) {
        logError('useIsCallerAdmin', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const profile = await actor.getCallerUserProfile();
        return profile || null;
      } catch (error) {
        logError('useGetCallerUserProfile', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Mutation hook for creating job posts
export function useCreateJobPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      workType,
      area,
      dateTime,
      salary,
      description,
      phone,
    }: {
      workType: string;
      area: string;
      dateTime: Time;
      salary: string;
      description: string;
      phone: string;
    }) => {
      if (!actor) {
        throw new Error('Actor not available');
      }
      try {
        const result = await actor.createJobPost(
          workType,
          area,
          dateTime,
          salary,
          description,
          phone
        );
        return result;
      } catch (error) {
        logError('useCreateJobPost', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['pending-jobs'] });
      queryClient.invalidateQueries({ queryKey: ['all-jobs'] });
    },
    onError: (error) => {
      logError('useCreateJobPost.onError', error);
    },
  });
}
