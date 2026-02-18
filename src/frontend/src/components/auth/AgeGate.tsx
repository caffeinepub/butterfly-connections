import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useConfirmEligibility } from '../../hooks/useQueries';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

export default function AgeGate() {
  const [confirmed, setConfirmed] = useState(false);
  const { mutate: confirmEligibility, isPending } = useConfirmEligibility();
  const { logout } = useAuth();

  const handleConfirm = () => {
    if (!confirmed) {
      toast.error('Please confirm you are 18 or older');
      return;
    }

    confirmEligibility(undefined, {
      onSuccess: () => {
        toast.success('Welcome to Butterfly Connections!');
      },
      onError: (error) => {
        toast.error('Failed to confirm eligibility. Please try again.');
        console.error(error);
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.98_0.02_320)] via-[oklch(0.96_0.03_340)] to-[oklch(0.94_0.04_360)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 space-y-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <img
              src="/assets/generated/butterfly-app-icon.dim_512x512.png"
              alt="Butterfly Connections"
              className="h-20 w-20"
            />
          </div>
          <h1 className="text-3xl font-bold text-[oklch(0.35_0.08_320)]">Age Verification</h1>
          <p className="text-[oklch(0.45_0.06_320)]">
            Butterfly Connections is a safe space for adults in our community. To continue, please confirm you meet our age requirement.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start space-x-3 p-4 bg-[oklch(0.96_0.03_340)] rounded-xl">
            <Checkbox
              id="age-confirm"
              checked={confirmed}
              onCheckedChange={(checked) => setConfirmed(checked === true)}
              className="mt-1"
            />
            <Label
              htmlFor="age-confirm"
              className="text-sm text-[oklch(0.35_0.08_320)] leading-relaxed cursor-pointer"
            >
              I confirm that I am <strong>18 years of age or older</strong> and agree to participate in this community with respect and authenticity.
            </Label>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirm}
              disabled={!confirmed || isPending}
              className="w-full bg-[oklch(0.65_0.15_320)] hover:bg-[oklch(0.60_0.15_320)] text-white py-6 rounded-full"
            >
              {isPending ? 'Confirming...' : 'Continue to Community'}
            </Button>

            <Button
              onClick={logout}
              variant="ghost"
              className="w-full text-[oklch(0.45_0.06_320)] hover:text-[oklch(0.35_0.08_320)]"
            >
              Sign Out
            </Button>
          </div>
        </div>

        <p className="text-xs text-center text-[oklch(0.50_0.06_320)]">
          By continuing, you acknowledge that this is an 18+ community space and agree to our community guidelines.
        </p>
      </div>
    </div>
  );
}
