import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ban, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from '@tanstack/react-router';

interface BannedScreenProps {
  reason?: string;
}

export default function BannedScreen({ reason }: BannedScreenProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await logout();
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.98_0.02_320)] via-[oklch(0.96_0.03_340)] to-[oklch(0.94_0.04_360)] flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
        <CardContent className="py-12 space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <Ban className="w-8 h-8 text-destructive" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-[oklch(0.35_0.08_320)]">Account Banned</h2>
            <div className="space-y-2">
              <p className="text-[oklch(0.45_0.06_320)]">
                Your account has been banned from Butterfly Connections.
              </p>
              {reason && (
                <div className="bg-destructive/10 border border-destructive/20 rounded p-3 text-left">
                  <p className="text-sm font-medium text-destructive mb-1">Reason:</p>
                  <p className="text-sm text-[oklch(0.35_0.08_320)]">{reason}</p>
                </div>
              )}
              <p className="text-sm text-[oklch(0.55_0.04_320)]">
                You no longer have access to community features. If you believe this is a mistake,
                please contact the community administrators.
              </p>
            </div>
          </div>

          <Button onClick={handleSignOut} variant="outline" className="w-full">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
