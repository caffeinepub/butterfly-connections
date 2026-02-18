import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import HelloCornerReactions from './HelloCornerReactions';
import { useGetMessageReactions, useReactToMessage, useRemoveReaction } from '../../hooks/useHelloCorner';
import { Skeleton } from '@/components/ui/skeleton';

// Local type definitions (backend doesn't export these)
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

interface HelloCornerMessageItemProps {
  message: HelloCornerMessage;
  currentUserReaction?: ReactionType | null;
}

export default function HelloCornerMessageItem({ message }: HelloCornerMessageItemProps) {
  const { data: reactions, isLoading: reactionsLoading } = useGetMessageReactions(message.id);
  const reactMutation = useReactToMessage();
  const removeReactionMutation = useRemoveReaction();

  const formatTimestamp = (timestamp: bigint) => {
    // For now, just show a placeholder since timestamp is 0
    // In a real app, you'd format the actual timestamp
    return 'Just now';
  };

  const handleReact = async (reaction: ReactionType) => {
    await reactMutation.mutateAsync({ messageId: message.id, reaction });
  };

  const handleRemoveReaction = async () => {
    await removeReactionMutation.mutateAsync(message.id);
  };

  // Determine current user's reaction (would need to track this in backend)
  // For now, we'll use local state managed by the reactions component
  const currentReaction: ReactionType | null = null;

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/assets/generated/default-avatar-set.dim_1024x1024.png" />
            <AvatarFallback className="bg-[oklch(0.65_0.15_320)] text-white">
              {message.author.toString().substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-[oklch(0.35_0.08_320)]">
                {message.author.toString().substring(0, 8)}...
              </span>
              <span className="text-xs text-[oklch(0.60_0.06_320)]">
                {formatTimestamp(message.createdAt)}
              </span>
            </div>

            <p className="text-[oklch(0.35_0.08_320)] whitespace-pre-wrap">{message.text}</p>

            {message.photo && (
              <img
                src={message.photo.getDirectURL()}
                alt="Message attachment"
                className="w-full max-h-96 object-cover rounded-lg border border-[oklch(0.90_0.02_320)]"
              />
            )}

            {message.video && (
              <video
                src={message.video.getDirectURL()}
                controls
                className="w-full max-h-96 rounded-lg border border-[oklch(0.90_0.02_320)]"
              />
            )}

            <div className="pt-2">
              {reactionsLoading ? (
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ) : reactions ? (
                <HelloCornerReactions
                  messageId={message.id}
                  likeCount={Number(reactions.likes)}
                  dislikeCount={Number(reactions.dislikes)}
                  currentReaction={currentReaction}
                  onReact={handleReact}
                  onRemoveReaction={handleRemoveReaction}
                />
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
