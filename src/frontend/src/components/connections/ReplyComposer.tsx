import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { useReplyToThread } from '../../hooks/useConnectionsForum';
import { normalizeForumError } from '../../utils/connectionsForumErrors';
import { toast } from 'sonner';
import type { ThreadId } from '../../backend';

interface ReplyComposerProps {
  threadId: ThreadId;
}

export default function ReplyComposer({ threadId }: ReplyComposerProps) {
  const [content, setContent] = useState('');
  const replyToThread = useReplyToThread();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      await replyToThread.mutateAsync({ threadId, content: content.trim() });
      toast.success('Reply posted successfully!');
      setContent('');
    } catch (error) {
      toast.error(normalizeForumError(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="reply">Add a Reply</Label>
        <Textarea
          id="reply"
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={replyToThread.isPending}
          rows={4}
          maxLength={2000}
          className="resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={replyToThread.isPending || !content.trim()}
          className="bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.55_0.15_320)] text-white"
        >
          {replyToThread.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Post Reply
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
