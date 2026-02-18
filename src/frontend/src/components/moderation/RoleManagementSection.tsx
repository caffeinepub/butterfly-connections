import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Shield } from 'lucide-react';

export default function RoleManagementSection() {
  return (
    <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
      <CardHeader>
        <CardTitle className="text-[oklch(0.35_0.08_320)] flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Role Management
          <span className="text-xs font-normal text-[oklch(0.45_0.06_320)] ml-2">(Admin Only)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 space-y-4">
          <AlertCircle className="w-12 h-12 mx-auto text-[oklch(0.65_0.15_320)]" />
          <div className="space-y-2">
            <p className="text-[oklch(0.45_0.06_320)]">
              Moderator role management is coming soon!
            </p>
            <p className="text-sm text-[oklch(0.55_0.04_320)]">
              You'll be able to appoint and remove moderators here.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
