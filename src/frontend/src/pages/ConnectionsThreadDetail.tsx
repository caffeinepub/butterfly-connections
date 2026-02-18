import { useParams, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, User, Clock, Loader2 } from 'lucide-react';
import { useGetThread, useGetThreadReplies } from '../hooks/useConnectionsForum';
import ReplyComposer from '../components/connections/ReplyComposer';
import RepliesList from '../components/connections/RepliesList';
import { normalizeForumError } from '../utils/connectionsForumErrors';

export default function ConnectionsThreadDetail() {
  const { threadId } = useParams({ from: '/connections/$threadId' });
  const navigate = useNavigate();
  
  const threadIdBigInt = threadId ? BigInt(threadId) : null;
  
  const { data: thread, isLoading: threadLoading, error: threadError } = useGetThread(threadIdBigInt);
  const { data: replies = [], isLoading: repliesLoading, error: repliesError } = useGetThreadReplies(threadIdBigInt);

  if (threadLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-[oklch(0.65_0.15_320)] animate-spin" />
        </div>
      </div>
    );
  }

  if (threadError) {
    return (
      <div className="space-y-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/connections' })}
          className="text-[oklch(0.55_0.15_320)] hover:text-[oklch(0.45_0.15_320)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Threads
        </Button>
        
        <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
          <CardContent className="p-12 text-center">
            <p className="text-red-600 mb-4">{normalizeForumError(threadError)}</p>
            <Button
              onClick={() => navigate({ to: '/connections' })}
              className="bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.55_0.15_320)] text-white"
            >
              Return to Threads
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="space-y-8">
        <Button
          variant="ghost"
          onClick={() => navigate({ to: '/connections' })}
          className="text-[oklch(0.55_0.15_320)] hover:text-[oklch(0.45_0.15_320)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Threads
        </Button>
        
        <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
          <CardContent className="p-12 text-center">
            <p className="text-[oklch(0.45_0.06_320)]">Thread not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Button
        variant="ghost"
        onClick={() => navigate({ to: '/connections' })}
        className="text-[oklch(0.55_0.15_320)] hover:text-[oklch(0.45_0.15_320)]"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Threads
      </Button>

      {/* Thread Content */}
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <CardTitle className="text-2xl text-[oklch(0.35_0.08_320)]">
            {thread.title}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-[oklch(0.55_0.06_320)] pt-2">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span className="font-mono text-xs truncate max-w-[150px]">
                {thread.author.toString().slice(0, 12)}...
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Just now</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-[oklch(0.35_0.08_320)] whitespace-pre-wrap leading-relaxed">
            {thread.content}
          </p>
        </CardContent>
      </Card>

      <Separator className="bg-[oklch(0.85_0.02_320)]" />

      {/* Reply Composer */}
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <CardTitle className="text-lg text-[oklch(0.35_0.08_320)]">Reply to Thread</CardTitle>
        </CardHeader>
        <CardContent>
          <ReplyComposer threadId={threadIdBigInt!} />
        </CardContent>
      </Card>

      {/* Replies List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[oklch(0.35_0.08_320)]">
          Replies ({replies.length})
        </h2>
        <RepliesList
          replies={replies}
          isLoading={repliesLoading}
          error={repliesError}
        />
      </div>
    </div>
  );
}
