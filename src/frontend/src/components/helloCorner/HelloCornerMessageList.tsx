import HelloCornerMessageItem from './HelloCornerMessageItem';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MessageCircle, Loader2 } from 'lucide-react';

// Local type definitions (backend doesn't export these)
type MessageId = bigint;
type ExternalBlob = any;

type HelloCornerMessage = {
  id: MessageId;
  author: any;
  text: string;
  photo: ExternalBlob | null;
  video: ExternalBlob | null;
  createdAt: bigint;
};

interface HelloCornerMessageListProps {
  messages: HelloCornerMessage[];
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isLoadingMore: boolean;
}

export default function HelloCornerMessageList({
  messages,
  isLoading,
  isError,
  hasMore,
  onLoadMore,
  isLoadingMore,
}: HelloCornerMessageListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardContent className="pt-6">
          <div className="text-center py-8 space-y-2">
            <p className="text-[oklch(0.45_0.06_320)]">Failed to load messages</p>
            <Button
              variant="outline"
              onClick={onLoadMore}
              className="border-[oklch(0.65_0.15_320)] text-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.65_0.15_320)] hover:text-white"
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (messages.length === 0) {
    return (
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardContent className="pt-6">
          <div className="text-center py-12 space-y-4">
            <MessageCircle className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
            <div className="space-y-2">
              <p className="text-[oklch(0.45_0.06_320)] font-medium">No messages yet</p>
              <p className="text-[oklch(0.60_0.06_320)] text-sm">
                Be the first to share a hello with the community!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <HelloCornerMessageItem key={message.id.toString()} message={message} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="border-[oklch(0.65_0.15_320)] text-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.65_0.15_320)] hover:text-white"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
