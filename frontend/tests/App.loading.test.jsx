/**
 * Separate test file to cover the PageLoader component inside App.jsx.
 * Uses a never-resolving lazy import so Suspense renders the fallback.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../src/App';

// Never-resolving mocks keep Dashboard/StorePage/NotFound perpetually loading
// so that React's Suspense always renders the <PageLoader /> fallback.
vi.mock('@/pages/Dashboard', async () => {
  await new Promise(() => {}); // Never resolves
  return { default: () => null };
});
vi.mock('@/pages/StorePage', async () => {
  await new Promise(() => {}); // Never resolves
  return { default: () => null };
});
vi.mock('@/pages/NotFound', async () => {
  await new Promise(() => {}); // Never resolves
  return { default: () => null };
});

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

describe('App — PageLoader Suspense fallback', () => {
  it('shows the PageLoader spinner while the Dashboard chunk is loading', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Loading page')).toBeInTheDocument();
  });

  it('shows the PageLoader spinner while the StorePage chunk is loading', () => {
    render(
      <MemoryRouter initialEntries={['/store/test-slug']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Loading page')).toBeInTheDocument();
  });

  it('shows the PageLoader spinner while the NotFound chunk is loading', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-path']}>
        <App />
      </MemoryRouter>,
    );
    expect(screen.getByLabelText('Loading page')).toBeInTheDocument();
  });
});
