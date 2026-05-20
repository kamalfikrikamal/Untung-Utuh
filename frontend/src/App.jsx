import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import Home from '@/pages/Home';
import OfflineBanner from '@/components/ui/OfflineBanner';
import InstallPrompt from '@/components/ui/InstallPrompt';

// Dynamic imports — each route gets its own JS chunk (code splitting)
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const StorePage  = lazy(() => import('@/pages/StorePage'));
const NotFound   = lazy(() => import('@/pages/NotFound'));

function PageLoader() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="flex items-center justify-center min-h-[60vh] text-slate-500"
    >
      <svg
        className="animate-spin h-8 w-8"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
      </svg>
    </div>
  );
}

export default function App() {
  return (
    <>
      <OfflineBanner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/store/:slug"
            element={
              <Suspense fallback={<PageLoader />}>
                <StorePage />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<PageLoader />}>
                <NotFound />
              </Suspense>
            }
          />
        </Route>
      </Routes>
      <InstallPrompt />
    </>
  );
}

