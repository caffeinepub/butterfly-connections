import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

// Local type definitions (backend doesn't export these)
type MessageId = bigint;
type ReactionType = { __kind__: 'like' } | { __kind__: 'dislike' };

interface HelloCornerReactionsProps {
  messageId: MessageId;
  likeCount: number;
  dislikeCount: number;
  currentReaction: ReactionType | null;
  onReact: (reaction: ReactionType) => Promise<void>;
  onRemoveReaction: () => Promise<void>;
}

export default function HelloCornerReactions({
  messageId,
  likeCount,
  dislikeCount,
  currentReaction,
  onReact,
  onRemoveReaction,
}: HelloCornerReactionsProps) {
  const [isPending, setIsPending] = useState(false);
  const [localReaction, setLocalReaction] = useState<ReactionType | null>(currentReaction);

  useEffect(() => {
    setLocalReaction(currentReaction);
  }, [currentReaction]);

  const handleReaction = async (reaction: ReactionType) => {
    if (isPending) return;

    setIsPending(true);
    try {
      if (localReaction?.__kind__ === reaction.__kind__) {
        // Remove reaction if clicking the same one
        await onRemoveReaction();
        setLocalReaction(null);
      } else {
        // Set new reaction
        await onReact(reaction);
        setLocalReaction(reaction);
      }
    } catch (error) {
      console.error('Error updating reaction:', error);
    } finally {
      setIsPending(false);
    }
  };

  const likeReaction: ReactionType = { __kind__: 'like' };
  const dislikeReaction: ReactionType = { __kind__: 'dislike' };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleReaction(likeReaction)}
        disabled={isPending}
        className={`border-[oklch(0.90_0.02_320)] ${
          localReaction?.__kind__ === 'like'
            ? 'bg-[oklch(0.65_0.15_320)] text-white border-[oklch(0.65_0.15_320)]'
            : 'text-[oklch(0.45_0.06_320)] hover:bg-[oklch(0.95_0.02_320)]'
        }`}
      >
        <ThumbsUp className="w-4 h-4 mr-1" />
        {likeCount}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleReaction(dislikeReaction)}
        disabled={isPending}
        className={`border-[oklch(0.90_0.02_320)] ${
          localReaction?.__kind__ === 'dislike'
            ? 'bg-[oklch(0.45_0.06_320)] text-white border-[oklch(0.45_0.06_320)]'
            : 'text-[oklch(0.45_0.06_320)] hover:bg-[oklch(0.95_0.02_320)]'
        }`}
      >
        <ThumbsDown className="w-4 h-4 mr-1" />
        {dislikeCount}
      </Button>
    </div>
  );
}
