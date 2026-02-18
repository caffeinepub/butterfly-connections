import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { useIsCallerModerator } from '../hooks/useModeration';
import ReportsSection from '../components/moderation/ReportsSection';
import UserActionsSection from '../components/moderation/UserActionsSection';
import RoleManagementSection from '../components/moderation/RoleManagementSection';
import { useIsCallerAdmin } from '../hooks/useQueries';

export default function Moderation() {
  const { isModerator, isLoading: moderatorLoading } = useIsCallerModerator();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isLoading = moderatorLoading || adminLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[oklch(0.65_0.15_320)] animate-spin mx-auto" />
          <p className="text-[oklch(0.45_0.06_320)]">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isModerator) {
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
        <div className="flex items-center justify-center gap-3">
          <Shield className="w-10 h-10 text-[oklch(0.65_0.15_320)]" />
          <h1 className="text-4xl font-bold text-[oklch(0.35_0.08_320)]">Moderation Dashboard</h1>
        </div>
        <p className="text-[oklch(0.45_0.06_320)] max-w-2xl mx-auto">
          Review reports, manage user actions, and keep the community safe.
        </p>
      </div>

      <Tabs defaultValue="reports" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="users">User Actions</TabsTrigger>
          <TabsTrigger value="roles" disabled={!isAdmin}>
            Role Management {!isAdmin && '(Admin)'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-6 mt-6">
          <ReportsSection />
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <UserActionsSection />
        </TabsContent>

        <TabsContent value="roles" className="space-y-6 mt-6">
          {isAdmin ? (
            <RoleManagementSection />
          ) : (
            <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
              <CardContent className="py-12">
                <div className="text-center space-y-4">
                  <AlertTriangle className="w-16 h-16 mx-auto text-[oklch(0.65_0.15_320)]" />
                  <p className="text-[oklch(0.45_0.06_320)]">
                    Role management is restricted to administrators only.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
