import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCircle } from 'lucide-react';

export default function Connections() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">My Connections</h1>
        <p className="text-[oklch(0.45_0.06_320)] max-w-2xl mx-auto">
          View and manage your connections with other community members.
        </p>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <CardTitle className="text-[oklch(0.35_0.08_320)]">Your Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <UserCircle className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
            <p className="text-[oklch(0.45_0.06_320)]">
              Connection features are coming soon! You'll be able to see your connections, pending requests, and manage your network here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
