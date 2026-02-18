import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// Stub types for missing Hello Corner functionality
type MessageId = bigint;
type ReactionType = { __kind__: 'like' } | { __kind__: 'dislike' };
type ExternalBlob = any;

type HelloCornerMessage = {
  id: MessageId;
  author: any;
  text: string;
  photo: ExternalBlob | null;
  video: ExternalBlob | null;
  createdAt: bigint;
};

type ReactionCounts = {
  likes: bigint;
  dislikes: bigint;
  userReaction: ReactionType | null;
};

// List messages - Stub implementation
export function useListHelloCornerMessages(offset: number, limit: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<HelloCornerMessage[]>({
    queryKey: ['helloCornerMessages', offset, limit],
    queryFn: async () => {
      // Stub: Return empty array since backend doesn't have Hello Corner
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

// Create message - Stub implementation
export function useCreateHelloCornerMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, photo, video }: { text: string; photo: ExternalBlob | null; video: ExternalBlob | null }) => {
      // Stub: Throw error since backend doesn't have Hello Corner
      throw new Error('Hello Corner feature not available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['helloCornerMessages'] });
    },
  });
}

// Get reactions - Stub implementation
export function useGetMessageReactions(messageId: MessageId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ReactionCounts>({
    queryKey: ['messageReactions', messageId?.toString()],
    queryFn: async () => {
      // Stub: Return zero counts
      return {
        likes: BigInt(0),
        dislikes: BigInt(0),
        userReaction: null,
      };
    },
    enabled: !!actor && !actorFetching && messageId !== null,
  });
}

// React to message - Stub implementation
export function useReactToMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ messageId, reaction }: { messageId: MessageId; reaction: ReactionType }) => {
      // Stub: Throw error since backend doesn't have Hello Corner
      throw new Error('Hello Corner feature not available');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messageReactions', variables.messageId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['helloCornerMessages'] });
    },
  });
}

// Remove reaction - Stub implementation
export function useRemoveReaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: MessageId) => {
      // Stub: Throw error since backend doesn't have Hello Corner
      throw new Error('Hello Corner feature not available');
    },
    onSuccess: (_, messageId) => {
      queryClient.invalidateQueries({ queryKey: ['messageReactions', messageId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['helloCornerMessages'] });
    },
  });
}
