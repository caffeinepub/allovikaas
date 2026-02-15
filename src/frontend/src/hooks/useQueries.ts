import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker, JobPost, UserProfile } from '@/backend';
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
