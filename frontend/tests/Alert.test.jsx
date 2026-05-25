import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Alert } from '@/components/ui/Alert';

describe('Alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Content</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Alert>Hello alert</Alert>);
    expect(screen.getByText('Hello alert')).toBeInTheDocument();
  });

  it('renders default info variant', () => {
    render(<Alert>Info</Alert>);
    expect(screen.getByRole('alert').className).toContain('bg-blue-50');
  });

  it('renders success variant', () => {
    render(<Alert variant="success">Done</Alert>);
    expect(screen.getByRole('alert').className).toContain('bg-green-50');
  });

  it('renders warning variant', () => {
    render(<Alert variant="warning">Caution</Alert>);
    expect(screen.getByRole('alert').className).toContain('bg-yellow-50');
  });

  it('renders error variant', () => {
    render(<Alert variant="error">Error</Alert>);
    expect(screen.getByRole('alert').className).toContain('bg-red-50');
  });

  it('renders title when provided', () => {
    render(<Alert title="Alert Title">Body</Alert>);
    expect(screen.getByText('Alert Title')).toBeInTheDocument();
  });

  it('does not render title element when not provided', () => {
    const { container } = render(<Alert>No title</Alert>);
    expect(container.querySelector('h5')).toBeNull();
  });

  it('applies custom className', () => {
    render(<Alert className="my-custom-class">Test</Alert>);
    expect(screen.getByRole('alert').className).toContain('my-custom-class');
  });
});
