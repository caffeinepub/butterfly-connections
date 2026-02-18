import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ReactionType, MessageId } from '../../backend';

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
      if (localReaction === reaction) {
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

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleReaction(ReactionType.like)}
        disabled={isPending}
        className={`border-[oklch(0.90_0.02_320)] ${
          localReaction === ReactionType.like
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
        onClick={() => handleReaction(ReactionType.dislike)}
        disabled={isPending}
        className={`border-[oklch(0.90_0.02_320)] ${
          localReaction === ReactionType.dislike
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
