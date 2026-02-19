import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HeaderBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <FooterBar />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: WorkerSearchResultsPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: WorkerRegistrationPage,
});

const postJobRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post-job',
  component: JobRequestPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanelPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogPage,
});

const workerProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/worker/$id',
  component: WorkerProfilePage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  searchRoute,
  registerRoute,
  postJobRoute,
  adminRoute,
  blogRoute,
  workerProfileRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </QueryClientProvider>
  );
}
