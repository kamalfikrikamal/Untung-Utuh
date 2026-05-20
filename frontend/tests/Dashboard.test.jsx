import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '@/pages/Dashboard';

vi.mock('@/hooks/useStore', () => ({
  useMyStores: vi.fn(),
}));

vi.mock('@/hooks/useProducts', () => ({
  useProducts: vi.fn(),
  useCreateProduct: vi.fn(),
  useUpdateProduct: vi.fn(),
  useDeleteProduct: vi.fn(),
}));

vi.mock('@/components/products/ProductCard', () => ({
  default: ({ product, onEdit, onDelete }) => (
    <div data-testid="product-card">
      <span>{product.name}</span>
      <button onClick={() => onEdit(product)}>edit</button>
      <button onClick={() => onDelete(product)}>delete</button>
    </div>
  ),
}));

vi.mock('@/components/products/ProductForm', () => ({
  default: ({ onSubmit }) => (
    <button
      data-testid="submit-form"
      onClick={() => onSubmit({ name: 'New Product', price: 10000 })}
    >
      Submit
    </button>
  ),
}));

vi.mock('@/components/ui/Modal', () => ({
  default: ({ open, children }) =>
    open ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock('@/components/ui/ConfirmDialog', () => ({
  default: ({ open, onConfirm, onClose }) =>
    open ? (
      <div data-testid="confirm-dialog">
        <button data-testid="confirm-btn" onClick={onConfirm}>Confirm</button>
        <button data-testid="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    ) : null,
}));

import { useMyStores } from '@/hooks/useStore';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProducts';

const noopMutation = { mutate: vi.fn(), isPending: false };
const mockStore = { _id: 'store1', name: 'My Shop' };

const renderDashboard = () =>
  render(<Dashboard />, { wrapper: BrowserRouter });

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useCreateProduct.mockReturnValue(noopMutation);
    useUpdateProduct.mockReturnValue(noopMutation);
    useDeleteProduct.mockReturnValue({ mutate: vi.fn(), isPending: false });
  });

  it('shows loading state while store data is loading', () => {
    useMyStores.mockReturnValue({ data: null, isLoading: true, isError: false });
    useProducts.mockReturnValue({ data: null, isLoading: false });
    renderDashboard();
    expect(screen.getByText(/Loading/i)).toBeTruthy();
  });

  it('shows no-store state when storeError is true', () => {
    useMyStores.mockReturnValue({ data: null, isLoading: false, isError: true });
    useProducts.mockReturnValue({ data: null, isLoading: false });
    renderDashboard();
    expect(screen.getByText(/No store found/i)).toBeTruthy();
  });

  it('shows no-store state when store list is empty', () => {
    useMyStores.mockReturnValue({
      data: { stores: [] },
      isLoading: false,
      isError: false,
    });
    useProducts.mockReturnValue({ data: null, isLoading: false });
    renderDashboard();
    expect(screen.getByText(/No store found/i)).toBeTruthy();
  });

  it('shows skeleton and "…" count while products are loading', () => {
    useMyStores.mockReturnValue({
      data: { stores: [mockStore] },
      isLoading: false,
      isError: false,
    });
    useProducts.mockReturnValue({ data: null, isLoading: true });
    renderDashboard();
    expect(screen.getByText('My Shop')).toBeTruthy();
    expect(screen.getByText('…')).toBeTruthy();
  });

  it('shows empty state when no products', () => {
    useMyStores.mockReturnValue({
      data: { stores: [mockStore] },
      isLoading: false,
      isError: false,
    });
    useProducts.mockReturnValue({ data: { products: [] }, isLoading: false });
    renderDashboard();
    expect(screen.getByText(/No products yet/i)).toBeTruthy();
    expect(screen.getByText('0 products')).toBeTruthy();
  });

  it('renders product cards and correct plural count', () => {
    const products = [
      { _id: 'p1', name: 'Widget A' },
      { _id: 'p2', name: 'Widget B' },
    ];
    useMyStores.mockReturnValue({
      data: { stores: [mockStore] },
      isLoading: false,
      isError: false,
    });
    useProducts.mockReturnValue({ data: { products }, isLoading: false });
    renderDashboard();
    expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    expect(screen.getByText('2 products')).toBeTruthy();
  });

  it('shows singular "product" for 1 product', () => {
    useMyStores.mockReturnValue({
      data: { stores: [mockStore] },
      isLoading: false,
      isError: false,
    });
    useProducts.mockReturnValue({
      data: { products: [{ _id: 'p1', name: 'Solo' }] },
      isLoading: false,
    });
    renderDashboard();
    expect(screen.getByText('1 product')).toBeTruthy();
  });

  it('opens create modal on Add Product click', () => {
    useMyStores.mockReturnValue({
      data: { stores: [mockStore] },
      isLoading: false,
      isError: false,
    });
    useProducts.mockReturnValue({ data: { products: [] }, isLoading: false });
    renderDashboard();
    fireEvent.click(screen.getByText('Add Product'));
    expect(screen.getByTestId('modal')).toBeTruthy();
    expect(screen.getByTestId('submit-form')).toBeTruthy();
  });

  it('calls createProduct on form submit in create mode', () => {
    const createMutate = vi.fn();
    useCreateProduct.mockReturnValue({ mutate: createMutate, isPending: false });
    useMyStores.mockReturnValue({
      data: { stores: [mockStore] },
      isLoading: false,
      isError: false,
    });
    useProducts.mockReturnValue({ data: { products: [] }, isLoading: false });
    renderDashboard();
    fireEvent.click(screen.getByText('Add Product'));
    fireEvent.click(screen.getByTestId('submit-form'));
    expect(createMutate).toHaveBeenCalledWith(
      expect.objectContaining({ store: 'store1' }),
      expect.any(Object)
    );
  });

  it('opens edit modal and calls updateProduct on submit', () => {
    const updateMutate = vi.fn();
    useUpdateProduct.mockReturnValue({ mutate: updateMutate, isPending: false });
    const products = [{ _id: 'p1', name: 'Editable' }];
    useMyStores.mockReturnValue({
      data: { stores: [mockStore] },
      isLoading: false,
      isError: false,
    });
    useProducts.mockReturnValue({ data: { products }, isLoading: false });
    renderDashboard();
    fireEvent.click(screen.getByText('edit'));
    fireEvent.click(screen.getByTestId('submit-form'));
    expect(updateMutate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'p1' }),
      expect.any(Object)
    );
  });

  it('calls deleteProduct on confirm delete', () => {
    const deleteMutate = vi.fn();
    useDeleteProduct.mockReturnValue({ mutate: deleteMutate, isPending: false });
    const products = [{ _id: 'p1', name: 'Deletable' }];
    useMyStores.mockReturnValue({
      data: { stores: [mockStore] },
      isLoading: false,
      isError: false,
    });
    useProducts.mockReturnValue({ data: { products }, isLoading: false });
    renderDashboard();
    fireEvent.click(screen.getByText('delete'));
    fireEvent.click(screen.getByTestId('confirm-btn'));
    expect(deleteMutate).toHaveBeenCalledWith('p1', expect.any(Object));
  });
});
