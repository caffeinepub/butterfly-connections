import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function Moderation() {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[oklch(0.65_0.15_320)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[oklch(0.45_0.06_320)]">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <AlertTriangle className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
              <h2 className="text-2xl font-bold text-[oklch(0.35_0.08_320)]">Access Denied</h2>
              <p className="text-[oklch(0.45_0.06_320)]">
                You don't have permission to access the moderation panel. This area is restricted to community moderators and administrators.
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
        <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">Moderation Panel</h1>
        <p className="text-[oklch(0.45_0.06_320)] max-w-2xl mx-auto">
          Review reported content and take action to keep our community safe.
        </p>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardHeader>
          <CardTitle className="text-[oklch(0.35_0.08_320)]">Reported Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 space-y-4">
            <Shield className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
            <p className="text-[oklch(0.45_0.06_320)]">
              Moderation features are coming soon! You'll be able to review reports, remove content, and manage community safety here.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
