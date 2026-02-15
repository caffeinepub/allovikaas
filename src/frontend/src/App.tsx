import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { I18nProvider } from './components/i18n/I18nProvider';
import HeaderBar from './components/landing/HeaderBar';
import FooterBar from './components/landing/FooterBar';
import HomePage from './pages/HomePage';
import WorkerSearchResultsPage from './pages/WorkerSearchResultsPage';
import WorkerRegistrationPage from './pages/WorkerRegistrationPage';
import JobRequestPage from './pages/JobRequestPage';
import AdminPanelPage from './pages/AdminPanelPage';

const queryClient = new QueryClient();

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
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
  path: '/register-worker',
  component: WorkerRegistrationPage,
});

const jobRequestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post-job',
  component: JobRequestPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminPanelPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  searchRoute,
  registerRoute,
  jobRequestRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <RouterProvider router={router} />
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
