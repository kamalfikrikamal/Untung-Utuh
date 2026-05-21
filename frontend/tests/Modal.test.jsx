import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../src/components/ui/Modal';

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal open={false} onClose={vi.fn()} title="Test" children={<p>Content</p>} />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders dialog with title when open', () => {
    render(<Modal open={true} onClose={vi.fn()} title="My Title" children={<p>Content</p>} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    expect(screen.getByText('My Title')).toBeTruthy();
  });

  it('renders dialog without title header when title is not provided', () => {
    render(<Modal open={true} onClose={vi.fn()} children={<p>Content</p>} />);
    expect(screen.getByRole('dialog')).toBeTruthy();
    // No title heading
    expect(screen.queryByRole('heading')).toBeNull();
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose} title="Test" children={<p>hi</p>} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose for non-Escape keydown', () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose} title="Test" children={<p>hi</p>} />);
    fireEvent.keyDown(document, { key: 'Enter' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('does not add keydown listener when closed', () => {
    const onClose = vi.fn();
    render(<Modal open={false} onClose={onClose} title="Test" children={<p>hi</p>} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    render(<Modal open={true} onClose={onClose} title="Test" children={<p>hi</p>} />);
    const backdrop = document.querySelector('[aria-hidden="true"]');
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
