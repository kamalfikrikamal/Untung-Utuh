import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUploadProductImages,
  useInfiniteProducts,
} from '@/hooks/useProducts';

vi.mock('@/services/productService', () => ({
  productService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    uploadImages: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

import { productService } from '@/services/productService';
import { toast } from 'sonner';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls getAll when params are provided', async () => {
    productService.getAll.mockResolvedValue({ data: { products: [], pagination: {} } });
    const { result } = renderHook(() => useProducts({ isActive: 'true' }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(productService.getAll).toHaveBeenCalledWith({ isActive: 'true' });
  });

  it('is disabled when params are null', () => {
    const { result } = renderHook(() => useProducts(null), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
    expect(productService.getAll).not.toHaveBeenCalled();
  });
});

describe('useProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls getById when id is provided', async () => {
    productService.getById.mockResolvedValue({ data: { product: { _id: '123', name: 'Item' } } });
    const { result } = renderHook(() => useProduct('123'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(productService.getById).toHaveBeenCalledWith('123');
  });

  it('is disabled when id is empty string', () => {
    const { result } = renderHook(() => useProduct(''), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
    expect(productService.getById).not.toHaveBeenCalled();
  });
});

describe('useCreateProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls productService.create and shows success toast', async () => {
    productService.create.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useCreateProduct(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate({ name: 'New Product' }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith('Product created successfully');
  });

  it('shows error toast with server message on failure', async () => {
    productService.create.mockRejectedValue({ response: { data: { message: 'Already exists' } } });
    const { result } = renderHook(() => useCreateProduct(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate({ name: 'Bad' }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Already exists');
  });

  it('shows fallback error toast when no server message', async () => {
    productService.create.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useCreateProduct(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate({ name: 'Bad' }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Failed to create product');
  });
});

describe('useUpdateProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls productService.update and shows success toast', async () => {
    productService.update.mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useUpdateProduct(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate({ id: '123', data: { name: 'Updated' } }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(productService.update).toHaveBeenCalledWith('123', { name: 'Updated' });
    expect(toast.success).toHaveBeenCalledWith('Product updated successfully');
  });

  it('shows error toast on update failure', async () => {
    productService.update.mockRejectedValue({ response: { data: { message: 'Not found' } } });
    const { result } = renderHook(() => useUpdateProduct(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate({ id: 'bad', data: {} }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Not found');
  });

  it('shows fallback error message when no server message', async () => {
    productService.update.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useUpdateProduct(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate({ id: 'bad', data: {} }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Failed to update product');
  });
});

describe('useDeleteProduct', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls productService.remove and shows success toast', async () => {
    productService.remove.mockResolvedValue({});
    const { result } = renderHook(() => useDeleteProduct(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate('123'));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(toast.success).toHaveBeenCalledWith('Product deactivated successfully');
  });

  it('shows error toast on delete failure', async () => {
    productService.remove.mockRejectedValue({ response: { data: { message: 'Error' } } });
    const { result } = renderHook(() => useDeleteProduct(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate('bad'));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Error');
  });

  it('shows fallback error message when no server message', async () => {
    productService.remove.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useDeleteProduct(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate('bad'));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Failed to delete product');
  });
});

describe('useUploadProductImages', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls productService.uploadImages on mutate', async () => {
    productService.uploadImages.mockResolvedValue({ data: { images: [] } });
    const { result } = renderHook(() => useUploadProductImages(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate({ id: '123', images: [] }));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(productService.uploadImages).toHaveBeenCalled();
  });

  it('shows error toast on upload failure', async () => {
    productService.uploadImages.mockRejectedValue({
      response: { data: { message: 'Upload failed' } },
    });
    const { result } = renderHook(() => useUploadProductImages(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate({ id: '123', images: [] }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Upload failed');
  });

  it('shows fallback error toast when no server message', async () => {
    productService.uploadImages.mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useUploadProductImages(), { wrapper: createWrapper() });
    await act(async () => result.current.mutate({ id: '123', images: [] }));
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(toast.error).toHaveBeenCalledWith('Failed to upload images');
  });
});

describe('useInfiniteProducts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls productService.getAll for the first page', async () => {
    productService.getAll.mockResolvedValue({
      data: { products: [], pagination: { page: 1, pages: 1 } },
    });
    const { result } = renderHook(() => useInfiniteProducts({ isActive: 'true' }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(productService.getAll).toHaveBeenCalledWith(
      expect.objectContaining({ isActive: 'true', page: 1 })
    );
  });

  it('is disabled when params are null', () => {
    const { result } = renderHook(() => useInfiniteProducts(null), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
    expect(productService.getAll).not.toHaveBeenCalled();
  });

  it('getNextPageParam returns next page number when page < pages', async () => {
    // First call returns page 1 of 3 — getNextPageParam should return 2
    productService.getAll.mockResolvedValue({
      data: { products: [{ _id: '1', name: 'A' }], pagination: { page: 1, pages: 3 } },
    });
    const { result } = renderHook(() => useInfiniteProducts({ isActive: 'true' }), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.hasNextPage).toBe(true);
  });
});
