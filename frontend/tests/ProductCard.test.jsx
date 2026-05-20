import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '@/components/products/ProductCard';

vi.mock('@/components/ui/LazyImage', () => ({
  default: ({ src, alt }) => <img src={src} alt={alt} data-testid="lazy-image" />,
}));

const baseProduct = {
  _id: 'p1',
  name: 'Widget Pro',
  price: 150000,
  stock: 10,
  category: 'electronics',
  isActive: true,
  images: [{ url: 'https://cdn/img.jpg' }],
};

describe('ProductCard', () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  beforeEach(() => vi.clearAllMocks());

  it('renders product name and formatted price', () => {
    render(<ProductCard product={baseProduct} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Widget Pro')).toBeTruthy();
    expect(screen.getByText(/Rp/)).toBeTruthy();
  });

  it('renders thumbnail via LazyImage when images exist', () => {
    render(<ProductCard product={baseProduct} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByTestId('lazy-image')).toBeTruthy();
  });

  it('renders placeholder emoji when no images', () => {
    render(
      <ProductCard
        product={{ ...baseProduct, images: [] }}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.queryByTestId('lazy-image')).toBeNull();
    expect(screen.getByText('📦')).toBeTruthy();
  });

  it('shows Active badge when isActive=true', () => {
    render(<ProductCard product={baseProduct} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('shows Inactive badge when isActive=false', () => {
    render(
      <ProductCard
        product={{ ...baseProduct, isActive: false }}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText('Inactive')).toBeTruthy();
  });

  it('shows "Out of stock" when stock is 0', () => {
    render(
      <ProductCard
        product={{ ...baseProduct, stock: 0 }}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText('Out of stock')).toBeTruthy();
  });

  it('shows stock count when stock > 0', () => {
    render(<ProductCard product={baseProduct} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('Stock: 10')).toBeTruthy();
  });

  it('uses yellow color class for low stock (1–4)', () => {
    const { container } = render(
      <ProductCard
        product={{ ...baseProduct, stock: 3 }}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(container.querySelector('.text-yellow-400')).toBeTruthy();
  });

  it('renders category badge with known color', () => {
    render(<ProductCard product={baseProduct} onEdit={onEdit} onDelete={onDelete} />);
    expect(screen.getByText('electronics')).toBeTruthy();
  });

  it('falls back to "other" category color for unknown category', () => {
    render(
      <ProductCard
        product={{ ...baseProduct, category: 'unknown-cat' }}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
    expect(screen.getByText('unknown-cat')).toBeTruthy();
  });

  it('calls onEdit with product when Edit is clicked', () => {
    render(<ProductCard product={baseProduct} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    expect(onEdit).toHaveBeenCalledWith(baseProduct);
  });

  it('calls onDelete with product when Delete is clicked', () => {
    render(<ProductCard product={baseProduct} onEdit={onEdit} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));
    expect(onDelete).toHaveBeenCalledWith(baseProduct);
  });
});
