import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { CommunityProfile, UserRole } from '../backend';
import { Principal } from '@dfinity/principal';

// Eligibility
export function useGetCallerEligibility() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ['eligibility'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.hasConfirmedEligibility();
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
      if (!actor) throw new Error('Actor not available');
      await actor.confirmEligibility();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eligibility'] });
    },
  });
}

// Profile
export function useGetCommunityProfile(userId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CommunityProfile | null>({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        const principal = Principal.fromText(userId);
        return await actor.getCommunityProfile(principal);
      } catch (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
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
      if (!actor) throw new Error('Actor not available');
      await actor.updateCommunityProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// Directory
export function useBrowseMentors(filters: { mentoring: boolean; mentorship: boolean }) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<CommunityProfile[]>({
    queryKey: ['mentors', filters],
    queryFn: async () => {
      if (!actor) return [];
      return actor.browseMentors(filters);
    },
    enabled: !!actor && !actorFetching,
  });
}

// Connections
export function useGetContacts(userId?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['contacts', userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      try {
        const principal = Principal.fromText(userId);
        return await actor.getContacts(principal);
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
      await actor.addContact(toPrincipal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// Reporting
export function useReportContent() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ contentId, reason }: { contentId: string; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.reportContent(contentId, reason);
    },
  });
}

export function useRemoveContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reportId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.removeContent(reportId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
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
