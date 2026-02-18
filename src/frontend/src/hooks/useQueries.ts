import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

// Stub types for missing backend functionality
type CommunityProfile = {
  displayName: string;
  pronouns: string;
  bio: string;
  tags: string[];
  avatar: Uint8Array | null;
  profilePhoto: Uint8Array | null;
  openToMentoring: boolean;
  seekingMentorship: boolean;
  supporterOfCommunity: boolean;
};

type ReportType = { __kind__: 'profile' } | { __kind__: 'message' };
type ReasonType = 
  | { __kind__: 'lecture' }
  | { __kind__: 'troll' }
  | { __kind__: 'offTopic' }
  | { __kind__: 'violation' }
  | { __kind__: 'insensitive' }
  | { __kind__: 'other'; value: string };

// Eligibility - Stub implementation (always returns true for now)
export function useGetCallerEligibility() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['eligibility'],
    queryFn: async () => {
      // Stub: Always return true since backend doesn't have eligibility system
      return true;
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

export function useConfirmEligibility() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Stub: No-op since backend doesn't have eligibility system
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eligibility'] });
    },
  });
}

// Profile - Stub implementation
export function useGetCommunityProfile(userId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CommunityProfile | null>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      // Stub: Return null since backend doesn't have profile system
      return null;
    },
    enabled: !!actor && !actorFetching && !!userId,
    retry: false,
  });
}

export function useUpdateCommunityProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CommunityProfile) => {
      // Stub: No-op since backend doesn't have profile system
      throw new Error('Profile system not available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Directory - Stub implementation
export function useBrowseMentors(filters: { mentoring: boolean; mentorship: boolean; supporterOfCommunity: boolean }) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CommunityProfile[]>({
    queryKey: ['mentors', filters],
    queryFn: async () => {
      // Stub: Return empty array since backend doesn't have profile/directory system
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

// Connections - Stub implementation (backend has different connection system)
export function useGetContacts(userId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['contacts', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        const principal = Principal.fromText(userId);
        return await actor.getUserConnections(principal);
      } catch (error) {
        console.error('Error fetching contacts:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useAddContact() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (toPrincipal: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.sendConnectionRequest(toPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// Reporting - Stub implementation
export function useReportContent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ 
      contentId, 
      contentType, 
      reasonType, 
      description 
    }: { 
      contentId: string; 
      contentType: ReportType; 
      reasonType: ReasonType; 
      description: string;
    }) => {
      // Stub: No-op since backend doesn't have reporting system
      throw new Error('Reporting system not available');
    },
  });
}

// Admin
export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching,
  });
}
