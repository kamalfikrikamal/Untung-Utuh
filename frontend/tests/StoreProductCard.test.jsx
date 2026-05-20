import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StoreProductCard from '@/components/store/StoreProductCard';

vi.mock('@/components/ui/LazyImage', () => ({
  default: ({ src, alt }) => <img src={src} alt={alt} />,
}));

describe('StoreProductCard', () => {
  const baseProduct = {
    name: 'Test Product',
    price: 50000,
    stock: 5,
    images: [],
  };

  it('renders product name', () => {
    render(<StoreProductCard product={baseProduct} onClick={vi.fn()} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders formatted price', () => {
    render(<StoreProductCard product={baseProduct} onClick={vi.fn()} />);
    expect(screen.getByText(/Rp/)).toBeInTheDocument();
  });

  it('shows stock count when stock > 0', () => {
    render(<StoreProductCard product={baseProduct} onClick={vi.fn()} />);
    expect(screen.getByText('5 available')).toBeInTheDocument();
  });

  it('shows "Out of stock" when stock is 0', () => {
    render(<StoreProductCard product={{ ...baseProduct, stock: 0 }} onClick={vi.fn()} />);
    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });

  it('renders LazyImage when product has a thumbnail', () => {
    const product = {
      ...baseProduct,
      images: [{ url: 'http://example.com/img.jpg' }],
    };
    render(<StoreProductCard product={product} onClick={vi.fn()} />);
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('renders placeholder emoji when no thumbnail', () => {
    render(<StoreProductCard product={baseProduct} onClick={vi.fn()} />);
    expect(screen.getByText('📦')).toBeInTheDocument();
  });

  it('calls onClick when the card button is clicked', () => {
    const onClick = vi.fn();
    render(<StoreProductCard product={baseProduct} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
