import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/Layout/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Skeleton } from './components/ui/Skeleton';

// Lazy loading pages
const Landing = lazy(() => import('./pages/Landing'));
const Fitur = lazy(() => import('./pages/Fitur'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const StorePage = lazy(() => import('./pages/StorePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

function PageLoader() {
  return (
    <div aria-label="Loading page" className="min-h-screen flex flex-col items-center justify-center p-24">
      <Skeleton className="h-12 w-64 mb-8" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Landing />} />
          <Route path="/fitur" element={<Fitur />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/store/:slug" element={<StorePage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
