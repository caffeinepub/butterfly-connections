import { ReactNode } from 'react';
import AuthedNav from '../nav/AuthedNav';
import BannedScreen from '../auth/BannedScreen';
import { Heart, Loader2 } from 'lucide-react';
import { useGetCallerBanStatus } from '../../hooks/useModeration';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const { data: banStatus, isLoading: banStatusLoading } = useGetCallerBanStatus();

  // Show loading state while checking ban status
  if (banStatusLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[oklch(0.98_0.02_320)] via-[oklch(0.96_0.03_340)] to-[oklch(0.94_0.04_360)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-[oklch(0.65_0.15_320)] animate-spin mx-auto" />
          <p className="text-[oklch(0.45_0.06_320)]">Loading...</p>
        </div>
      </div>
    );
  }

  // Show banned screen if user is banned
  if (banStatus?.isBanned) {
    return <BannedScreen reason={banStatus.reason || undefined} />;
  }

  // Normal app shell for non-banned users
  return (
    <div className="min-h-screen bg-gradient-to-br from-[oklch(0.98_0.02_320)] via-[oklch(0.96_0.03_340)] to-[oklch(0.94_0.04_360)]">
      <AuthedNav />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>

      <footer className="bg-[oklch(0.35_0.08_320)] text-white py-6 mt-16">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="flex items-center justify-center gap-2 text-sm">
            Built with <Heart className="w-4 h-4 fill-current text-[oklch(0.75_0.15_320)]" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[oklch(0.85_0.10_320)] transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-[oklch(0.70_0.08_320)]">
            © {new Date().getFullYear()} Butterfly Connections
          </p>
        </div>
      </footer>
    </div>
  );
}
