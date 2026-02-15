import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Worker, JobPost } from '@/backend';

export function useGetApprovedJobs() {
  const { actor, isFetching } = useActor();

  return useQuery<JobPost[]>({
    queryKey: ['approved-jobs'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getApprovedJobs();
      } catch (error) {
        console.error('Error fetching approved jobs:', error);
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
        return await actor.getPendingWorkers();
      } catch (error) {
        console.error('Error fetching pending workers:', error);
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
        return await actor.getAllWorkers();
      } catch (error) {
        console.error('Error fetching all workers:', error);
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
        return await actor.getPendingJobPosts();
      } catch (error) {
        console.error('Error fetching pending job posts:', error);
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
        return await actor.getAllJobPosts();
      } catch (error) {
        console.error('Error fetching all job posts:', error);
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
        return await actor.isCallerAdmin();
      } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}
