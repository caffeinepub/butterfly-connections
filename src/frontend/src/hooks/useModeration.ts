import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@dfinity/principal';
import type { Report, UserRole } from '../backend';

// Caller role and permissions
export function useGetCallerRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsCallerModerator() {
  const { data: role, isLoading } = useGetCallerRole();
  // Currently only admins have moderation access until moderator role is added to backend
  return {
    isModerator: role === 'admin',
    isLoading,
  };
}

// Reports
export function useListReports(skip: number = 0, take: number = 20) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Report[]>({
    queryKey: ['reports', skip, take],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listReports(BigInt(skip), BigInt(take));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useResolveReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.resolveReport(reportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

// Ban management
export function useBanUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, reason }: { user: string; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(user);
      await actor.banUser(principal, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banStatus'] });
    },
  });
}

export function useUnbanUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (user: string) => {
      if (!actor) throw new Error('Actor not available');
      const principal = Principal.fromText(user);
      await actor.unbanUser(principal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banStatus'] });
    },
  });
}

export function useGetBanStatus(user: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ isBanned: boolean; reason?: string }>({
    queryKey: ['banStatus', user],
    queryFn: async () => {
      if (!actor || !user) return { isBanned: false };
      try {
        const principal = Principal.fromText(user);
        const isBanned = await actor.isUserBannedForAdminCheck(principal);
        if (isBanned) {
          const reason = await actor.getBanReason(principal);
          return { isBanned: true, reason };
        }
        return { isBanned: false };
      } catch (error) {
        return { isBanned: false };
      }
    },
    enabled: !!actor && !actorFetching && !!user,
  });
}

// Caller ban status (for banned screen)
export function useGetCallerBanStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ isBanned: boolean; reason?: string }>({
    queryKey: ['callerBanStatus'],
    queryFn: async () => {
      if (!actor) return { isBanned: false };
      try {
        // Try to get caller role - if banned, this will trap
        await actor.getCallerUserRole();
        return { isBanned: false };
      } catch (error: any) {
        // Check if error message indicates ban
        if (error?.message?.includes('banned') || error?.message?.includes('Banned')) {
          return { isBanned: true, reason: 'Your account has been banned' };
        }
        return { isBanned: false };
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
