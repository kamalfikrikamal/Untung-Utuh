import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('sonner', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Toaster: ({ ...props }) => <div data-testid="sonner-toaster" {...props} />,
  };
});

import { Toaster } from '@/components/ui/Toast';

describe('Toaster', () => {
  it('renders without crashing', () => {
    render(<Toaster />);
    expect(screen.getByTestId('sonner-toaster')).toBeInTheDocument();
  });

  it('forwards extra props to the Toaster', () => {
    render(<Toaster position="top-right" />);
    expect(screen.getByTestId('sonner-toaster')).toHaveAttribute('position', 'top-right');
  });
});
