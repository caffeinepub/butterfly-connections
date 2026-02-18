import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import { useGetCallerPermissions } from '../hooks/useModeration';

export default function Moderation() {
  const { data: permissions, isLoading } = useGetCallerPermissions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[oklch(0.75_0.15_320)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[oklch(0.45_0.06_320)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!permissions?.isAdmin && !permissions?.isModerator) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">Moderation</h1>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
          <CardContent className="p-12 text-center space-y-4">
            <Shield className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
            <div>
              <h3 className="text-lg font-semibold text-[oklch(0.35_0.08_320)] mb-2">
                Access Denied
              </h3>
              <p className="text-[oklch(0.45_0.06_320)]">
                You don't have permission to access moderation tools.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">Moderation</h1>
        <p className="text-[oklch(0.45_0.06_320)] max-w-2xl mx-auto">
          Manage reports and community safety.
        </p>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <CardTitle className="text-[oklch(0.35_0.08_320)]">Moderation Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <Shield className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
            <p className="text-[oklch(0.45_0.06_320)]">
              Moderation features are temporarily unavailable. Please check back later!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
