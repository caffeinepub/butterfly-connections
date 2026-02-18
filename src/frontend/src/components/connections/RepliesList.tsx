import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User, MessageSquare } from 'lucide-react';
import type { ConnectionsReply } from '../../backend';

interface RepliesListProps {
  replies: ConnectionsReply[];
  isLoading: boolean;
  error: Error | null;
}

export default function RepliesList({ replies, isLoading, error }: RepliesListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Error loading replies: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (replies.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardContent className="p-8 text-center space-y-3">
          <MessageSquare className="w-12 h-12 mx-auto text-[oklch(0.65_0.15_320)]" />
          <div>
            <h4 className="font-semibold text-[oklch(0.35_0.08_320)] mb-1">No replies yet</h4>
            <p className="text-sm text-[oklch(0.45_0.06_320)]">
              Be the first to reply to this thread!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <Card key={reply.id.toString()} className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3 text-sm text-[oklch(0.55_0.06_320)]">
              <User className="w-4 h-4" />
              <span className="font-mono text-xs truncate">
                {reply.author.toString().slice(0, 12)}...
              </span>
              <span className="text-[oklch(0.65_0.06_320)]">•</span>
              <span>Just now</span>
            </div>
            <p className="text-[oklch(0.35_0.08_320)] whitespace-pre-wrap">{reply.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
