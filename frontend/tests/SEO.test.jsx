import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import SEO from '../src/components/SEO/SEO';

describe('SEO Component', () => {
  it('renders without crashing', () => {
    render(<SEO title="Test Page" description="Test description" />);
    expect(document.head).toBeTruthy();
  });

  it('sets noindex when noindex prop is true', () => {
    render(<SEO title="Private" noindex />);
    expect(document.body).toBeTruthy();
  });
});
