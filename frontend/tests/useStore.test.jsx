import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMyStores, useStoreBySlug } from '@/hooks/useStore';

vi.mock('@/services/storeService', () => ({
  storeService: {
    getMy: vi.fn(),
    getBySlug: vi.fn(),
  },
}));

import { storeService } from '@/services/storeService';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMyStores', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls storeService.getMy and returns store data', async () => {
    storeService.getMy.mockResolvedValue({ data: { stores: [{ _id: '1' }] } });
    const { result } = renderHook(() => useMyStores(), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(storeService.getMy).toHaveBeenCalled();
    expect(result.current.data).toEqual({ stores: [{ _id: '1' }] });
  });
});

describe('useStoreBySlug', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls storeService.getBySlug with the correct slug', async () => {
    storeService.getBySlug.mockResolvedValue({ data: { store: { _id: '1', name: 'Test' } } });
    const { result } = renderHook(() => useStoreBySlug('my-store'), { wrapper: createWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(storeService.getBySlug).toHaveBeenCalledWith('my-store');
    expect(result.current.data).toEqual({ store: { _id: '1', name: 'Test' } });
  });

  it('is disabled when slug is an empty string', () => {
    const { result } = renderHook(() => useStoreBySlug(''), { wrapper: createWrapper() });
    expect(result.current.isPending).toBe(true);
    expect(storeService.getBySlug).not.toHaveBeenCalled();
  });
});
