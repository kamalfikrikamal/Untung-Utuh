import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ProductDetailModal from '@/components/store/ProductDetailModal';

vi.mock('@/services/analyticsService', () => ({
  trackEvent: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/components/ui/Modal', () => ({
  default: ({ open, children, title }) =>
    open ? (
      <div data-testid="modal" aria-label={title}>
        {children}
      </div>
    ) : null,
}));

import { trackEvent } from '@/services/analyticsService';

const baseProduct = {
  _id: 'p1',
  name: 'Widget Pro',
  description: 'A great widget',
  price: 100000,
  stock: 5,
  category: 'electronics',
  images: [{ url: 'https://cdn/img1.jpg' }, { url: 'https://cdn/img2.jpg' }],
};

describe('ProductDetailModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.open = vi.fn();
  });

  it('renders null when product is null', () => {
    const { container } = render(
      <ProductDetailModal product={null} onClose={onClose} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders product name, price and description', () => {
    render(
      <ProductDetailModal product={baseProduct} onClose={onClose} storeId="s1" />
    );
    expect(screen.getByText('A great widget')).toBeTruthy();
    expect(screen.getAllByText(/Rp/)[0]).toBeTruthy();
  });

  it('tracks click event on mount', async () => {
    await act(async () => {
      render(
        <ProductDetailModal product={baseProduct} onClose={onClose} storeId="s1" />
      );
    });
    expect(trackEvent).toHaveBeenCalledWith({
      storeId: 's1',
      productId: 'p1',
      eventType: 'click',
    });
  });

  it('does not track when storeId is missing', async () => {
    await act(async () => {
      render(<ProductDetailModal product={baseProduct} onClose={onClose} />);
    });
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it('shows quantity selector when stock > 0', () => {
    render(
      <ProductDetailModal product={baseProduct} onClose={onClose} storeId="s1" />
    );
    expect(screen.getByText('Quantity')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('hides quantity selector when stock = 0', () => {
    render(
      <ProductDetailModal
        product={{ ...baseProduct, stock: 0 }}
        onClose={onClose}
        storeId="s1"
      />
    );
    expect(screen.queryByText('Quantity')).toBeNull();
    expect(screen.getByText('Out of stock')).toBeTruthy();
  });

  it('increments and decrements quantity', () => {
    render(
      <ProductDetailModal product={baseProduct} onClose={onClose} storeId="s1" />
    );
    const [decBtn, incBtn] = screen.getAllByRole('button').filter((b) =>
      ['−', '+'].includes(b.textContent)
    );
    fireEvent.click(incBtn);
    expect(screen.getByText('2')).toBeTruthy();
    fireEvent.click(decBtn);
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('does not decrement below 1', () => {
    render(
      <ProductDetailModal product={baseProduct} onClose={onClose} storeId="s1" />
    );
    const decBtn = screen.getAllByRole('button').find((b) => b.textContent === '−');
    fireEvent.click(decBtn);
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('shows multiple image thumbnails and switches active image', () => {
    render(
      <ProductDetailModal product={baseProduct} onClose={onClose} storeId="s1" />
    );
    const thumbButtons = screen.getAllByRole('button').filter(
      (b) => b.className.includes('shrink-0')
    );
    expect(thumbButtons.length).toBe(2);
    fireEvent.click(thumbButtons[1]);
    // Active image changes (second thumbnail now selected)
    expect(thumbButtons[1].className).toContain('border-blue-500');
  });

  it('renders placeholder emoji when no images', () => {
    render(
      <ProductDetailModal
        product={{ ...baseProduct, images: [] }}
        onClose={onClose}
        storeId="s1"
      />
    );
    expect(screen.getByText('📦')).toBeTruthy();
  });

  it('hides description section when not provided', () => {
    render(
      <ProductDetailModal
        product={{ ...baseProduct, description: undefined }}
        onClose={onClose}
        storeId="s1"
      />
    );
    expect(screen.queryByText('A great widget')).toBeNull();
  });

  it('shows WhatsApp button and calls trackEvent + window.open on click', async () => {
    render(
      <ProductDetailModal
        product={baseProduct}
        onClose={onClose}
        storeId="s1"
        whatsapp="081234567890"
      />
    );
    const waBtn = screen.getByRole('button', { name: /Order via WhatsApp/i });
    await act(async () => {
      fireEvent.click(waBtn);
    });
    expect(trackEvent).toHaveBeenCalledWith(
      expect.objectContaining({ eventType: 'wa_order' })
    );
    expect(globalThis.open).toHaveBeenCalledWith(
      expect.stringContaining('wa.me'),
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('hides WhatsApp button when whatsapp prop is absent', () => {
    render(
      <ProductDetailModal product={baseProduct} onClose={onClose} storeId="s1" />
    );
    expect(
      screen.queryByRole('button', { name: /Order via WhatsApp/i })
    ).toBeNull();
  });
});
