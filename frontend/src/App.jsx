import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppShell } from './components/Layout/AppShell';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Skeleton } from './components/ui/Skeleton';

// Lazy loading pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function SuspenseFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-24">
      <Skeleton className="h-12 w-64 mb-8" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />}>
              {/* Nested Dashboard routes go here */}
              <Route index element={<div className="text-gray-500">Select an option from the sidebar.</div>} />
              <Route path="projects" element={<div>Projects Component</div>} />
              <Route path="team" element={<div>Team Component</div>} />
              <Route path="settings" element={<div>Settings Component</div>} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
