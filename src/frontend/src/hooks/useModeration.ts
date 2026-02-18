import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

// Stub types for missing moderation functionality
type ReportId = bigint;
type ReportStatus = { __kind__: 'pending' } | { __kind__: 'reviewed' };
type ReportType = { __kind__: 'profile' } | { __kind__: 'message' };
type ReasonType = 
  | { __kind__: 'lecture' }
  | { __kind__: 'troll' }
  | { __kind__: 'offTopic' }
  | { __kind__: 'violation' }
  | { __kind__: 'insensitive' }
  | { __kind__: 'other'; value: string };

type Report = {
  id: ReportId;
  reporter: Principal;
  contentId: string;
  reportType: ReportType;
  reasonType: ReasonType;
  description: string;
  status: ReportStatus;
  timestamp: bigint;
};

// Get caller permissions
export function useGetCallerPermissions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ isAdmin: boolean; isModerator: boolean }>({
    queryKey: ['callerPermissions'],
    queryFn: async () => {
      if (!actor) return { isAdmin: false, isModerator: false };
      const isAdmin = await actor.isCallerAdmin();
      return { isAdmin, isModerator: false };
    },
    enabled: !!actor && !actorFetching,
  });
}

// List reports - Stub implementation
export function useListReports(skip: number, take: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Report[]>({
    queryKey: ['reports', skip, take],
    queryFn: async () => {
      // Stub: Return empty array since backend doesn't have reporting system
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

// Resolve report - Stub implementation
export function useResolveReport() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: ReportId) => {
      // Stub: Throw error since backend doesn't have reporting system
      throw new Error('Reporting system not available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

// Ban user - Stub implementation
export function useBanUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ principal, reason }: { principal: Principal; reason: string }) => {
      // Stub: Throw error since backend doesn't have ban system
      throw new Error('Ban system not available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banStatus'] });
    },
  });
}

// Unban user - Stub implementation
export function useUnbanUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (principal: Principal) => {
      // Stub: Throw error since backend doesn't have ban system
      throw new Error('Ban system not available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banStatus'] });
    },
  });
}

// Check ban status - Stub implementation
export function useCheckBanStatus(principalText: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ isBanned: boolean; reason: string | null }>({
    queryKey: ['banStatus', principalText],
    queryFn: async () => {
      // Stub: Return not banned since backend doesn't have ban system
      return { isBanned: false, reason: null };
    },
    enabled: !!actor && !actorFetching && !!principalText,
  });
}

// Get caller ban status - Stub implementation
export function useGetCallerBanStatus() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<{ isBanned: boolean; reason: string | null }>({
    queryKey: ['callerBanStatus'],
    queryFn: async () => {
      // Stub: Return not banned since backend doesn't have ban system
      return { isBanned: false, reason: null };
    },
    enabled: !!actor && !actorFetching,
  });
}
