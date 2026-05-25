import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StorePage from '@/pages/StorePage';

vi.mock('react-router-dom', () => ({
  useParams: () => ({ slug: 'test-store' }),
}));

vi.mock('@/hooks/useStore', () => ({
  useStoreBySlug: vi.fn(),
}));

vi.mock('@/hooks/useProducts', () => ({
  useInfiniteProducts: vi.fn(),
}));

vi.mock('@/hooks/useDebounce', () => ({
  useDebounce: vi.fn((v) => v),
}));

vi.mock('@/hooks/useAnalytics', () => ({
  useTrackEvent: vi.fn(),
}));

vi.mock('@/components/store/StoreHeader', () => ({
  default: ({ store }) => <div data-testid="store-header">{store.name}</div>,
}));

vi.mock('@/components/store/StoreProductCard', () => ({
  default: ({ product, onClick }) => (
    <button data-testid="product-card" onClick={onClick}>
      {product.name}
    </button>
  ),
}));

vi.mock('@/components/store/ProductDetailModal', () => ({
  default: ({ product, onClose }) =>
    product ? (
      <div data-testid="product-modal">
        {product.name}
        <button data-testid="close-modal" onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock('@/components/ui/Skeleton', () => ({
  StoreProductCardSkeleton: () => <div data-testid="skeleton" />,
}));

import { useStoreBySlug } from '@/hooks/useStore';
import { useInfiniteProducts } from '@/hooks/useProducts';

// IntersectionObserver mock — calls the callback immediately on observe()
// so intersection-related code paths are exercised in tests.
let lastIntersectionCallback;
class MockIntersectionObserver {
  constructor(cb) {
    this._cb = cb;
    lastIntersectionCallback = cb;
  }
  observe() {
    // Simulate "not intersecting" by default (hasNextPage is false in most tests)
    this._cb([{ isIntersecting: false }]);
  }
  disconnect() {}
}
globalThis.IntersectionObserver = MockIntersectionObserver;

const mockStore = { _id: 'store-1', name: 'Test Store', whatsapp: '628123456789' };
const mockProduct = { _id: 'p1', name: 'Product One' };

const defaultProductsResult = {
  data: { pages: [{ data: { products: [] } }] },
  isLoading: false,
  isFetchingNextPage: false,
  hasNextPage: false,
  fetchNextPage: vi.fn(),
};

describe('StorePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useStoreBySlug.mockReturnValue({
      data: { store: mockStore },
      isLoading: false,
      isError: false,
    });
    useInfiniteProducts.mockReturnValue(defaultProductsResult);
  });

  it('shows loading indicator while store is being fetched', () => {
    useStoreBySlug.mockReturnValue({ data: undefined, isLoading: true, isError: false });
    render(<StorePage />);
    expect(screen.getByText(/Loading store/)).toBeInTheDocument();
  });

  it('shows store-not-found message on error', () => {
    useStoreBySlug.mockReturnValue({ data: undefined, isLoading: false, isError: true });
    render(<StorePage />);
    expect(screen.getByText('Store not found.')).toBeInTheDocument();
  });

  it('shows store-not-found message when store is null', () => {
    useStoreBySlug.mockReturnValue({ data: { store: null }, isLoading: false, isError: false });
    render(<StorePage />);
    expect(screen.getByText('Store not found.')).toBeInTheDocument();
  });

  it('renders StoreHeader when store is loaded', () => {
    render(<StorePage />);
    expect(screen.getByTestId('store-header')).toBeInTheDocument();
  });

  it('shows skeleton cards while products are loading', () => {
    useInfiniteProducts.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetchingNextPage: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
    });
    render(<StorePage />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('shows empty state when no products are found', () => {
    render(<StorePage />);
    expect(screen.getByText('No products found.')).toBeInTheDocument();
  });

  it('renders product cards when products are available', () => {
    useInfiniteProducts.mockReturnValue({
      ...defaultProductsResult,
      data: { pages: [{ data: { products: [mockProduct] } }] },
    });
    render(<StorePage />);
    expect(screen.getByTestId('product-card')).toBeInTheDocument();
    expect(screen.getByText('Product One')).toBeInTheDocument();
  });

  it('shows "Semua produk sudah ditampilkan" when all pages are loaded', () => {
    useInfiniteProducts.mockReturnValue({
      ...defaultProductsResult,
      data: { pages: [{ data: { products: [mockProduct] } }] },
      hasNextPage: false,
    });
    render(<StorePage />);
    expect(screen.getByText('Semua produk sudah ditampilkan')).toBeInTheDocument();
  });

  it('shows next-page skeleton cards when fetching next page', () => {
    useInfiniteProducts.mockReturnValue({
      ...defaultProductsResult,
      data: { pages: [{ data: { products: [mockProduct] } }] },
      isFetchingNextPage: true,
    });
    render(<StorePage />);
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0);
  });

  it('updates search input value on change', () => {
    render(<StorePage />);
    const input = screen.getByPlaceholderText('Search products…');
    fireEvent.change(input, { target: { value: 'sneakers' } });
    expect(input.value).toBe('sneakers');
  });

  it('updates category select value on change', () => {
    render(<StorePage />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'fashion' } });
    expect(select.value).toBe('fashion');
  });

  it('opens product detail modal when a product card is clicked', () => {
    useInfiniteProducts.mockReturnValue({
      ...defaultProductsResult,
      data: { pages: [{ data: { products: [mockProduct] } }] },
    });
    render(<StorePage />);
    fireEvent.click(screen.getByTestId('product-card'));
    expect(screen.getByTestId('product-modal')).toBeInTheDocument();
  });

  it('closes product detail modal when onClose is called', () => {
    useInfiniteProducts.mockReturnValue({
      ...defaultProductsResult,
      data: { pages: [{ data: { products: [mockProduct] } }] },
    });
    render(<StorePage />);
    fireEvent.click(screen.getByTestId('product-card'));
    expect(screen.getByTestId('product-modal')).toBeInTheDocument();
    // Trigger onClose — covers the arrow function at L178
    fireEvent.click(screen.getByTestId('close-modal'));
    expect(screen.queryByTestId('product-modal')).toBeNull();
  });

  it('useEffect sentinel guard returns early when products are loading (no sentinel div)', async () => {
    const { act } = await import('@testing-library/react');
    useInfiniteProducts.mockReturnValue({
      ...defaultProductsResult,
      data: undefined,
      isLoading: true,
    });
    const { container } = render(<StorePage />);
    // Flush all pending effects — sentinelRef.current is null when skeleton renders
    await act(async () => {});
    // Component rendered skeletons without the sentinel div; effect should have returned early
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('calls fetchNextPage when sentinel becomes visible and hasNextPage is true', async () => {
    const fetchNextPage = vi.fn();
    useInfiniteProducts.mockReturnValue({
      ...defaultProductsResult,
      data: { pages: [{ data: { products: [mockProduct] } }] },
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage,
    });
    render(<StorePage />);
    // lastIntersectionCallback was captured when observe() was called;
    // re-trigger it with isIntersecting: true
    await act(async () => {
      lastIntersectionCallback([{ isIntersecting: true }]);
    });
    expect(fetchNextPage).toHaveBeenCalled();
  });
});
