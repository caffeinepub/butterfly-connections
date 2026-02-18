import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerEligibility } from './hooks/useQueries';
import Landing from './pages/Landing';
import AgeGate from './components/auth/AgeGate';
import Feed from './pages/Feed';
import ProfileMe from './pages/ProfileMe';
import ProfileView from './pages/ProfileView';
import Directory from './pages/Directory';
import Connections from './pages/Connections';
import ConnectionsThreadDetail from './pages/ConnectionsThreadDetail';
import Guidelines from './pages/Guidelines';
import Moderation from './pages/Moderation';
import PostDetail from './pages/PostDetail';
import AppShell from './components/layout/AppShell';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public routes
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

const ageGateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/age-gate',
  component: AgeGate,
});

// Authenticated routes
const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  component: () => (
    <AppShell>
      <Feed />
    </AppShell>
  ),
});

const postDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$postId',
  component: () => (
    <AppShell>
      <PostDetail />
    </AppShell>
  ),
});

const profileMeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: () => (
    <AppShell>
      <ProfileMe />
    </AppShell>
  ),
});

const profileViewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$userId',
  component: () => (
    <AppShell>
      <ProfileView />
    </AppShell>
  ),
});

const directoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/directory',
  component: () => (
    <AppShell>
      <Directory />
    </AppShell>
  ),
});

const connectionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/connections',
  component: () => (
    <AppShell>
      <Connections />
    </AppShell>
  ),
});

const connectionsThreadDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/connections/$threadId',
  component: () => (
    <AppShell>
      <ConnectionsThreadDetail />
    </AppShell>
  ),
});

const guidelinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/guidelines',
  component: () => (
    <AppShell>
      <Guidelines />
    </AppShell>
  ),
});

const moderationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/moderation',
  component: () => (
    <AppShell>
      <Moderation />
    </AppShell>
  ),
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  ageGateRoute,
  feedRoute,
  postDetailRoute,
  profileMeRoute,
  profileViewRoute,
  directoryRoute,
  connectionsRoute,
  connectionsThreadDetailRoute,
  guidelinesRoute,
  moderationRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function AppRouter() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: hasEligibility, isLoading: eligibilityLoading, isFetched } = useGetCallerEligibility();

  // Show loading state during initialization
  if (isInitializing || (identity && eligibilityLoading && !isFetched)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[oklch(0.98_0.02_320)] via-[oklch(0.96_0.03_340)] to-[oklch(0.94_0.04_360)]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[oklch(0.75_0.15_320)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[oklch(0.45_0.08_320)] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect logic based on auth and eligibility state
  const currentPath = window.location.pathname;
  
  if (!identity) {
    // Not authenticated - only allow landing page
    if (currentPath !== '/') {
      window.history.replaceState(null, '', '/');
    }
  } else if (!hasEligibility) {
    // Authenticated but not eligible - redirect to age gate
    if (currentPath !== '/age-gate') {
      window.history.replaceState(null, '', '/age-gate');
    }
  } else {
    // Authenticated and eligible - redirect from landing/age-gate to feed
    if (currentPath === '/' || currentPath === '/age-gate') {
      window.history.replaceState(null, '', '/feed');
    }
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AppRouter />
      <Toaster />
    </ThemeProvider>
  );
}
