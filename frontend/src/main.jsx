import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import App from './App';
import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Register service worker in production only (avoids HMR conflicts in dev)
function notifyNewVersion(newWorker) {
  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
    toast.info('Versi baru tersedia!', {
      duration: Infinity,
      action: {
        label: 'Perbarui',
        onClick: () => {
          newWorker.postMessage('SKIP_WAITING');
            globalThis.location.reload();
        },
      },
    });
  }
}

function handleUpdateFound(reg) {
  const newWorker = reg.installing;
  newWorker?.addEventListener('statechange', () => notifyNewVersion(newWorker));
}

function registerServiceWorker() {
  navigator.serviceWorker
    .register('/sw.js')
    .then((reg) => reg.addEventListener('updatefound', () => handleUpdateFound(reg)))
    .catch((err) => console.error('[SW] Registration failed:', err));
}

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  globalThis.addEventListener('load', registerServiceWorker);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
