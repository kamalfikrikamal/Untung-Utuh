import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

// Mock lazy-loaded page components so routes resolve synchronously
vi.mock('@/pages/Dashboard', () => ({ default: () => <div>Dashboard Page</div> }));
vi.mock('@/pages/StorePage', () => ({ default: () => <div>Store Page</div> }));
vi.mock('@/pages/NotFound', () => ({ default: () => <div>Not Found Page</div> }));

// Mock hooks used by OfflineBanner and InstallPrompt
vi.mock('@/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => ({ isOnline: true }),
}));
vi.mock('@/hooks/useInstallPrompt', () => ({
  useInstallPrompt: () => ({
    canInstall: false,
    isInstalled: false,
    install: vi.fn(),
    dismiss: vi.fn(),
  }),
}));

describe('App', () => {
  it('renders without crashing on the home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    expect(document.body).toBeTruthy();
  });

  it('renders the Dashboard page at /dashboard', async () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument();
  });

  it('renders the StorePage at /store/:slug', async () => {
    render(
      <MemoryRouter initialEntries={['/store/my-store']}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Store Page')).toBeInTheDocument();
  });

  it('renders NotFound for unknown routes', async () => {
    render(
      <MemoryRouter initialEntries={['/this-does-not-exist']}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Not Found Page')).toBeInTheDocument();
  });

  it('renders OfflineBanner (hidden when online) and InstallPrompt (hidden when not installable)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );
    // Both components return null given the mocked hook values
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
  });
});
