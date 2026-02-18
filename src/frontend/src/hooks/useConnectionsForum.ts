import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ConnectionsThread, ConnectionsReply, ThreadId, ReplyId } from '../backend';

// List threads with pagination
export function useListThreads(offset: number, limit: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ConnectionsThread[]>({
    queryKey: ['threads', offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listThreads(BigInt(offset), BigInt(limit));
    },
    enabled: !!actor && !actorFetching,
  });
}

// Create a new thread
export function useCreateThread() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title, content }: { title: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createThread(title, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });
}

// Get a single thread by ID
export function useGetThread(threadId: ThreadId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ConnectionsThread | null>({
    queryKey: ['thread', threadId?.toString()],
    queryFn: async () => {
      if (!actor || threadId === null) return null;
      try {
        return await actor.getThread(threadId);
      } catch (error) {
        console.error('Error fetching thread:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && threadId !== null,
    retry: false,
  });
}

// Get replies for a thread
export function useGetThreadReplies(threadId: ThreadId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ConnectionsReply[]>({
    queryKey: ['threadReplies', threadId?.toString()],
    queryFn: async () => {
      if (!actor || threadId === null) return [];
      try {
        return await actor.getThreadReplies(threadId);
      } catch (error) {
        console.error('Error fetching replies:', error);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && threadId !== null,
    retry: false,
  });
}

// Reply to a thread
export function useReplyToThread() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ threadId, content }: { threadId: ThreadId; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.replyToThread(threadId, content);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['threadReplies', variables.threadId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['thread', variables.threadId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['threads'] });
    },
  });
}
