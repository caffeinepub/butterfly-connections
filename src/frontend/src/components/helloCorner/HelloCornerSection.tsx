import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MessageCircleHeart } from 'lucide-react';
import HelloCornerComposer from './HelloCornerComposer';
import HelloCornerMessageList from './HelloCornerMessageList';
import { useListHelloCornerMessages, useCreateHelloCornerMessage } from '../../hooks/useHelloCorner';

// Local type definition
type ExternalBlob = any;

export default function HelloCornerSection() {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data = [], isLoading, isError, refetch } = useListHelloCornerMessages(offset, limit);
  const createMessageMutation = useCreateHelloCornerMessage();

  const handleSubmit = async (text: string, photo: ExternalBlob | null, video: ExternalBlob | null) => {
    await createMessageMutation.mutateAsync({ text, photo, video });
    // Reset to first page after posting
    setOffset(0);
  };

  const handleLoadMore = () => {
    setOffset(offset + limit);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-[oklch(0.95_0.05_320)] to-[oklch(0.92_0.08_340)] border-[oklch(0.85_0.10_320)]">
        <CardHeader>
          <div className="flex items-center gap-3">
            <MessageCircleHeart className="w-8 h-8 text-[oklch(0.65_0.15_320)]" />
            <div>
              <CardTitle className="text-2xl text-[oklch(0.35_0.08_320)]">Hello Corner</CardTitle>
              <CardDescription className="text-[oklch(0.50_0.06_320)]">
                Share greetings, thoughts, photos, and videos with the community
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <HelloCornerComposer
        onSubmit={handleSubmit}
        isSubmitting={createMessageMutation.isPending}
      />

      <HelloCornerMessageList
        messages={data}
        isLoading={isLoading}
        isError={isError}
        hasMore={false}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoading && offset > 0}
      />
    </div>
  );
}
