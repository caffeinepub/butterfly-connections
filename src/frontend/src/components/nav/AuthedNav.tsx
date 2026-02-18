import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Home, Users, UserCircle, BookOpen, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useIsCallerAdmin } from '../../hooks/useQueries';

export default function AuthedNav() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { data: isAdmin } = useIsCallerAdmin();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/' });
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-[oklch(0.90_0.02_320)] sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/feed" className="flex items-center gap-2">
            <img
              src="/assets/generated/butterfly-app-icon.dim_512x512.png"
              alt="Butterfly Connections"
              className="h-8 w-8"
            />
            <span className="font-bold text-[oklch(0.35_0.08_320)] hidden sm:inline">
              Butterfly Connections
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2">
            <NavLink to="/feed" icon={<Home className="w-4 h-4" />} label="Feed" />
            <NavLink to="/directory" icon={<Users className="w-4 h-4" />} label="Directory" />
            <NavLink to="/connections" icon={<UserCircle className="w-4 h-4" />} label="Connections" />
            <NavLink to="/profile" icon={<UserCircle className="w-4 h-4" />} label="Profile" />
            <NavLink to="/guidelines" icon={<BookOpen className="w-4 h-4" />} label="Guidelines" />
            
            {isAdmin && (
              <NavLink to="/moderation" icon={<Shield className="w-4 h-4" />} label="Moderation" />
            )}

            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-[oklch(0.45_0.06_320)] hover:text-[oklch(0.35_0.08_320)] hover:bg-[oklch(0.96_0.03_340)]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to}>
      {({ isActive }) => (
        <Button
          variant="ghost"
          size="sm"
          className={`${
            isActive
              ? 'bg-[oklch(0.65_0.15_320)] text-white hover:bg-[oklch(0.60_0.15_320)] hover:text-white'
              : 'text-[oklch(0.45_0.06_320)] hover:text-[oklch(0.35_0.08_320)] hover:bg-[oklch(0.96_0.03_340)]'
          }`}
        >
          {icon}
          <span className="ml-2 hidden md:inline">{label}</span>
        </Button>
      )}
    </Link>
  );
}
