import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Ban, CheckCircle, Loader2, UserX } from 'lucide-react';
import { useBanUser, useUnbanUser, useCheckBanStatus } from '../../hooks/useModeration';
import { Principal } from '@dfinity/principal';

export default function UserActionsSection() {
  const [principalInput, setPrincipalInput] = useState('');
  const [banReason, setBanReason] = useState('');
  const [validPrincipal, setValidPrincipal] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data: banStatus, isLoading: banStatusLoading } = useCheckBanStatus(validPrincipal);
  const banUser = useBanUser();
  const unbanUser = useUnbanUser();

  const handleValidate = () => {
    setValidationError(null);
    setValidPrincipal(null);

    if (!principalInput.trim()) {
      setValidationError('Please enter a Principal ID');
      return;
    }

    try {
      Principal.fromText(principalInput.trim());
      setValidPrincipal(principalInput.trim());
    } catch (error) {
      setValidationError('Invalid Principal ID format');
    }
  };

  const handleBan = async () => {
    if (!validPrincipal || !banReason.trim()) return;

    try {
      const principal = Principal.fromText(validPrincipal);
      await banUser.mutateAsync({ principal, reason: banReason.trim() });
      setBanReason('');
    } catch (error: any) {
      console.error('Failed to ban user:', error);
    }
  };

  const handleUnban = async () => {
    if (!validPrincipal) return;

    try {
      const principal = Principal.fromText(validPrincipal);
      await unbanUser.mutateAsync(principal);
    } catch (error: any) {
      console.error('Failed to unban user:', error);
    }
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-[oklch(0.90_0.02_320)]">
      <CardHeader>
        <CardTitle className="text-[oklch(0.35_0.08_320)]">User Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Principal Input */}
        <div className="space-y-2">
          <Label htmlFor="principal">User Principal ID</Label>
          <div className="flex gap-2">
            <Input
              id="principal"
              placeholder="Enter Principal ID"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleValidate} variant="outline">
              Check
            </Button>
          </div>
          {validationError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="w-4 h-4" />
              {validationError}
            </div>
          )}
        </div>

        {/* Ban Status Display */}
        {validPrincipal && (
          <div className="border border-[oklch(0.90_0.02_320)] rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-[oklch(0.35_0.08_320)]">User Status</h3>
              {banStatusLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[oklch(0.65_0.15_320)]" />
              ) : banStatus?.isBanned ? (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <UserX className="w-3 h-3" />
                  Banned
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </Badge>
              )}
            </div>

            <p className="text-sm text-[oklch(0.45_0.06_320)] break-all">
              <span className="font-medium">Principal:</span> {validPrincipal}
            </p>

            {banStatus?.isBanned && banStatus.reason && (
              <div className="bg-destructive/10 border border-destructive/20 rounded p-3">
                <p className="text-sm font-medium text-destructive mb-1">Ban Reason:</p>
                <p className="text-sm text-[oklch(0.35_0.08_320)]">{banStatus.reason}</p>
              </div>
            )}

            {/* Ban/Unban Actions */}
            {!banStatusLoading && (
              <div className="space-y-4 pt-2">
                {banStatus?.isBanned ? (
                  <Button
                    onClick={handleUnban}
                    disabled={unbanUser.isPending}
                    variant="outline"
                    className="w-full"
                  >
                    {unbanUser.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Unbanning...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Unban User
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="banReason">Ban Reason</Label>
                      <Textarea
                        id="banReason"
                        placeholder="Enter reason for banning this user..."
                        value={banReason}
                        onChange={(e) => setBanReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={handleBan}
                      disabled={banUser.isPending || !banReason.trim()}
                      variant="destructive"
                      className="w-full"
                    >
                      {banUser.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Banning...
                        </>
                      ) : (
                        <>
                          <Ban className="w-4 h-4 mr-2" />
                          Ban User
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Success/Error Messages */}
            {banUser.isSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded">
                <CheckCircle className="w-4 h-4" />
                User has been banned successfully
              </div>
            )}
            {unbanUser.isSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded">
                <CheckCircle className="w-4 h-4" />
                User has been unbanned successfully
              </div>
            )}
            {(banUser.isError || unbanUser.isError) && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded">
                <AlertCircle className="w-4 h-4" />
                Action failed. Please try again.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
