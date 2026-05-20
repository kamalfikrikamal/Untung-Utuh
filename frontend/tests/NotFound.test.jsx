import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '@/pages/NotFound';

describe('NotFound', () => {
  it('renders 404 heading', () => {
    render(<NotFound />, { wrapper: BrowserRouter });
    expect(screen.getByText('404')).toBeTruthy();
    expect(screen.getByText('Page not found')).toBeTruthy();
  });

  it('contains a link back to home', () => {
    render(<NotFound />, { wrapper: BrowserRouter });
    const link = screen.getByRole('link', { name: /Back to Home/i });
    expect(link.getAttribute('href')).toBe('/');
  });
});
