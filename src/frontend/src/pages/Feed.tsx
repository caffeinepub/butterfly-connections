import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function Feed() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">Community Feed</h1>
        <p className="text-[oklch(0.45_0.06_320)] max-w-2xl mx-auto">
          Share your story, connect with others, and celebrate your journey in our safe and affirming space.
        </p>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <CardTitle className="text-[oklch(0.35_0.08_320)]">Share Your Story</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <Sparkles className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
            <p className="text-[oklch(0.45_0.06_320)]">
              Posting features are coming soon! We're building a beautiful space for you to share your thoughts, experiences, and connect with the community.
            </p>
            <Button
              disabled
              className="bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.60_0.15_320)] text-white"
            >
              Create Post (Coming Soon)
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-[oklch(0.50_0.06_320)] text-sm">
        <p>Posts, comments, and community interactions will appear here once the backend is fully connected.</p>
      </div>
    </div>
  );
}
