import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageSquare, User, Clock } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import type { ConnectionsThread } from '../../backend';

interface ConnectionsThreadListProps {
  threads: ConnectionsThread[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

export default function ConnectionsThreadList({
  threads,
  isLoading,
  error,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: ConnectionsThreadListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
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
          <p className="text-red-600">Error loading threads: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (threads.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardContent className="p-12 text-center space-y-4">
          <MessageSquare className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
          <div>
            <h3 className="text-lg font-semibold text-[oklch(0.35_0.08_320)] mb-2">
              No threads yet
            </h3>
            <p className="text-[oklch(0.45_0.06_320)]">
              Be the first to start a conversation! Create a new thread to connect with your network.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <Link
          key={thread.id.toString()}
          to="/connections/$threadId"
          params={{ threadId: thread.id.toString() }}
          className="block"
        >
          <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)] hover:border-[oklch(0.65_0.15_320)] transition-colors cursor-pointer">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-[oklch(0.35_0.08_320)] mb-2 hover:text-[oklch(0.55_0.15_320)] transition-colors">
                {thread.title}
              </h3>
              <p className="text-[oklch(0.45_0.06_320)] mb-4 line-clamp-2">
                {thread.content}
              </p>
              <div className="flex items-center gap-4 text-sm text-[oklch(0.55_0.06_320)]">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span className="font-mono text-xs truncate max-w-[120px]">
                    {thread.author.toString().slice(0, 8)}...
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  <span>{thread.replies.length} {thread.replies.length === 1 ? 'reply' : 'replies'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Just now</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      
      {hasMore && (
        <div className="text-center pt-4">
          <Button
            onClick={onLoadMore}
            disabled={isLoadingMore}
            variant="outline"
            className="border-[oklch(0.65_0.15_320)] text-[oklch(0.55_0.15_320)] hover:bg-[oklch(0.65_0.15_320)] hover:text-white"
          >
            {isLoadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}
