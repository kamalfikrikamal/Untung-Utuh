import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input', () => {
  it('renders an input element', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('renders with the given type', () => {
    render(<Input type="email" placeholder="email" />);
    expect(screen.getByPlaceholderText('email')).toHaveAttribute('type', 'email');
  });

  it('shows error message when error prop is provided', () => {
    render(<Input error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('adds red border class when error prop is provided', () => {
    render(<Input error="Invalid" placeholder="input" />);
    expect(screen.getByPlaceholderText('input').className).toContain('border-red-500');
  });

  it('does not render error paragraph when no error', () => {
    const { container } = render(<Input placeholder="ok" />);
    expect(container.querySelector('p')).toBeNull();
  });

  it('applies custom className to the input element', () => {
    render(<Input className="w-full" placeholder="styled" />);
    expect(screen.getByPlaceholderText('styled').className).toContain('w-full');
  });

  it('forwards additional props to the input', () => {
    render(<Input data-testid="my-input" />);
    expect(screen.getByTestId('my-input')).toBeInTheDocument();
  });
});
