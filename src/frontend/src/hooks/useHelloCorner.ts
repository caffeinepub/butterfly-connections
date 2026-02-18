import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { HelloCornerMessage, MessageId, ReactionType, ExternalBlob } from '../backend';

// List Hello Corner messages with pagination
export function useListHelloCornerMessages(offset: bigint = 0n, limit: bigint = 20n) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['helloCornerMessages', offset.toString(), limit.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.listHelloCornerMessages(offset, limit);
    },
    enabled: !!actor && !actorFetching,
  });
}

// Create a new Hello Corner message with optional photo and video
export function useCreateHelloCornerMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, photo, video }: { text: string; photo: ExternalBlob | null; video: ExternalBlob | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createHelloCornerMessage(text, photo, video);
    },
    onSuccess: () => {
      // Invalidate all message queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['helloCornerMessages'] });
      queryClient.invalidateQueries({ queryKey: ['messageReactions'] });
    },
  });
}

// Get reactions for a specific message
export function useGetMessageReactions(messageId: MessageId) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['messageReactions', messageId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMessageReactions(messageId);
    },
    enabled: !!actor && !actorFetching,
  });
}

// React to a message (like or dislike)
export function useReactToMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, reaction }: { messageId: MessageId; reaction: ReactionType }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.reactToMessage(messageId, reaction);
    },
    onSuccess: (_, variables) => {
      // Invalidate reactions for this specific message
      queryClient.invalidateQueries({ queryKey: ['messageReactions', variables.messageId.toString()] });
    },
  });
}

// Remove reaction from a message
export function useRemoveReaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: MessageId) => {
      if (!actor) throw new Error('Actor not available');
      await actor.removeReaction(messageId);
    },
    onSuccess: (_, messageId) => {
      // Invalidate reactions for this specific message
      queryClient.invalidateQueries({ queryKey: ['messageReactions', messageId.toString()] });
    },
  });
}
