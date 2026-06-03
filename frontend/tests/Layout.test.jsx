import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, afterEach } from 'vitest';
import Layout from '../src/components/layout/Layout';

describe('Layout', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders the header, main area, and footer', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByRole('banner')).toBeInTheDocument();   // <header>
    expect(screen.getByRole('main')).toBeInTheDocument();     // <main>
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // <footer>
  });

  it('shows VITE_APP_NAME from env when it is set', () => {
    vi.stubEnv('VITE_APP_NAME', 'My Custom App');
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByText('My Custom App')).toBeInTheDocument();
  });

  it('falls back to "MERN App" when VITE_APP_NAME is empty', () => {
    vi.stubEnv('VITE_APP_NAME', '');
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    expect(screen.getByText('MERN App')).toBeInTheDocument();
  });

  it('shows the current year in the footer copyright', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
  });
});
