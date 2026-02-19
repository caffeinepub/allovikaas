import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { Worker, UserProfile } from '@/backend';
import { logError } from '@/utils/errors';

// Query key for public workers list - used for invalidation after registration
export const PUBLIC_WORKERS_QUERY_KEY = ['public-workers'];

/**
 * Fetches all active workers visible to the public (including anonymous users).
 * This is the primary query for browsing/searching workers.
 */
export function useGetPublicWorkers() {
  const { actor, isFetching } = useActor();

  return useQuery<Worker[]>({
    queryKey: PUBLIC_WORKERS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      try {
        const workers = await actor.getPublicWorkers();
        return Array.isArray(workers) ? workers : [];
      } catch (error) {
        logError('useGetPublicWorkers', error);
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const query = useQuery<boolean>({
    queryKey: ['is-admin', identity?.getPrincipal().toString()],
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
    enabled: !!actor && !actorFetching && !isInitializing && !!identity,
    retry: 1,
    staleTime: 5000,
  });

  return {
    ...query,
    isLoading: actorFetching || isInitializing || query.isLoading,
    isFetched: !!actor && !actorFetching && !isInitializing && query.isFetched,
  };
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

export function useGetWorkerById(workerId: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Worker | null>({
    queryKey: ['worker', workerId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const worker = await actor.getWorkerById(workerId);
        return worker || null;
      } catch (error) {
        logError('useGetWorkerById', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && workerId > BigInt(0),
    retry: false,
  });
}
