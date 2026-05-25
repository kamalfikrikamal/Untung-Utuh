import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from '@/components/ui/Label';

describe('Label', () => {
  it('renders children text', () => {
    render(<Label>Email Address</Label>);
    expect(screen.getByText('Email Address')).toBeInTheDocument();
  });

  it('renders a <label> element', () => {
    const { container } = render(<Label>Username</Label>);
    expect(container.querySelector('label')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Label className="text-red-500">Label</Label>);
    expect(container.querySelector('label').className).toContain('text-red-500');
  });

  it('forwards htmlFor prop', () => {
    const { container } = render(<Label htmlFor="email">Email</Label>);
    expect(container.querySelector('label')).toHaveAttribute('for', 'email');
  });

  it('forwards additional props', () => {
    render(<Label data-testid="my-label">Test</Label>);
    expect(screen.getByTestId('my-label')).toBeInTheDocument();
  });
});
