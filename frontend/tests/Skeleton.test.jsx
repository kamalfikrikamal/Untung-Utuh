import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Skeleton, ProductCardSkeleton, StoreProductCardSkeleton } from '@/components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders with default classes', () => {
    const { container } = render(<Skeleton />);
    const el = container.firstChild;
    expect(el.getAttribute('aria-hidden')).toBe('true');
    expect(el.className).toContain('animate-pulse');
  });

  it('accepts extra className', () => {
    const { container } = render(<Skeleton className="h-10 w-full" />);
    expect(container.firstChild.className).toContain('h-10');
  });
});

describe('ProductCardSkeleton', () => {
  it('renders with aria-busy', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
  });
});

describe('StoreProductCardSkeleton', () => {
  it('renders with aria-busy', () => {
    const { container } = render(<StoreProductCardSkeleton />);
    expect(container.querySelector('[aria-busy="true"]')).toBeTruthy();
  });
});
