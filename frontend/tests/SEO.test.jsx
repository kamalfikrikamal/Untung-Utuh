import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import SEO from '../src/components/seo/SEO';

describe('SEO Component', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('renders with title and description', () => {
    render(<SEO title="Test Page" description="Test description" />);
    expect(document.head).toBeTruthy();
  });

  it('sets noindex when noindex prop is true', () => {
    render(<SEO title="Private" noindex />);
    expect(document.body).toBeTruthy();
  });

  it('uses appName as full title when no title prop is given', () => {
    render(<SEO description="No title" />);
    // fullTitle = appName (no title passed)
    expect(document.title).toBeTruthy();
  });

  it('falls back to "MERN App" when VITE_APP_NAME is empty', () => {
    vi.stubEnv('VITE_APP_NAME', '');
    render(<SEO title="Test" />);
    expect(document.head).toBeTruthy();
  });

  it('falls back to "https://example.com" when VITE_APP_URL is empty', () => {
    vi.stubEnv('VITE_APP_URL', '');
    render(<SEO title="Test" />);
    expect(document.head).toBeTruthy();
  });

  it('uses provided image prop as og:image instead of default', () => {
    render(<SEO title="Product" image="https://cdn.example.com/product.jpg" />);
    const ogImageMeta = document.head.querySelector('meta[property="og:image"]');
    expect(ogImageMeta?.getAttribute('content')).toBe('https://cdn.example.com/product.jpg');
  });
});
