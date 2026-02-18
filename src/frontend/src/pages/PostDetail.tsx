import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function PostDetail() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardContent className="py-12">
          <div className="text-center space-y-4">
            <MessageCircle className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
            <p className="text-[oklch(0.45_0.06_320)]">
              Post details and comments will appear here once the backend is fully connected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
