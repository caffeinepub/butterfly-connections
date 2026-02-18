import { useState } from 'react';
import { useListThreads } from '../hooks/useConnectionsForum';
import NewThreadComposer from '../components/connections/NewThreadComposer';
import ConnectionsThreadList from '../components/connections/ConnectionsThreadList';

const THREADS_PER_PAGE = 10;

export default function Connections() {
  const [offset, setOffset] = useState(0);
  
  const { data: threads = [], isLoading, error } = useListThreads(offset, THREADS_PER_PAGE);
  const { data: nextPageThreads = [], isLoading: isLoadingMore } = useListThreads(
    offset + THREADS_PER_PAGE,
    1
  );

  const hasMore = nextPageThreads.length > 0;

  const handleLoadMore = () => {
    setOffset((prev) => prev + THREADS_PER_PAGE);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">My Connections</h1>
          <p className="text-[oklch(0.45_0.06_320)]">
            Share and discuss with your network in a forum-style board.
          </p>
        </div>
        <NewThreadComposer />
      </div>

      <ConnectionsThreadList
        threads={threads}
        isLoading={isLoading}
        error={error}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoadingMore}
      />
    </div>
  );
}
