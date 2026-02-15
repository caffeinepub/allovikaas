import { StrictMode } from 'react';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import WorkerSearchResultsPage from './pages/WorkerSearchResultsPage';
import WorkerRegistrationPage from './pages/WorkerRegistrationPage';
import JobRequestPage from './pages/JobRequestPage';
import AdminPanelPage from './pages/AdminPanelPage';
import BlogPage from './pages/BlogPage';
import WorkerProfilePage from './pages/WorkerProfilePage';
import HeaderBar from './components/landing/HeaderBar';
import FooterBar from './components/landing/FooterBar';
import { I18nProvider } from './components/i18n/I18nProvider';
import RouteErrorBoundary from './components/common/RouteErrorBoundary';

// Root route with shared layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <HeaderBar />
      <main className="flex-1">
        <RouteErrorBoundary>
          <Outlet />
        </RouteErrorBoundary>
      </main>
      <FooterBar />
    </div>
  ),
});

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// Search route with search params
const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: WorkerSearchResultsPage,
});

// Worker registration route
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: WorkerRegistrationPage,
});

// Job request route with search params for prefills
const jobRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post-job',
  component: JobRequestPage,
});

// Admin panel route
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanelPage,
});

// Blog route
const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage,
});

// Worker profile route
const workerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/$id',
  component: WorkerProfilePage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  searchRoute,
  registerRoute,
  jobRequestRoute,
  adminRoute,
  blogRoute,
  workerProfileRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </StrictMode>
  );
}
