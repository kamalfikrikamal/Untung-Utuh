import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const baseProps = {
  open: true,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  message: 'Are you sure you want to delete?',
};

describe('ConfirmDialog', () => {
  it('renders message and default title when open', () => {
    render(<ConfirmDialog {...baseProps} />);
    expect(screen.getByText('Are you sure you want to delete?')).toBeTruthy();
    expect(screen.getByText('Confirm Action')).toBeTruthy();
  });

  it('renders custom title and confirmLabel', () => {
    render(
      <ConfirmDialog
        {...baseProps}
        title="Remove Item"
        confirmLabel="Remove"
      />
    );
    expect(screen.getByText('Remove Item')).toBeTruthy();
    expect(screen.getByText('Remove')).toBeTruthy();
  });

  it('shows Processing… when loading=true', () => {
    render(<ConfirmDialog {...baseProps} loading={true} />);
    expect(screen.getByText('Processing…')).toBeTruthy();
  });

  it('does not render content when closed', () => {
    render(<ConfirmDialog {...baseProps} open={false} />);
    expect(screen.queryByText('Are you sure you want to delete?')).toBeNull();
  });
});
