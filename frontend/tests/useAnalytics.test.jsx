import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTrackEvent, useAnalyticsSummary } from '@/hooks/useAnalytics';

vi.mock('@/services/analyticsService', () => ({
  trackEvent: vi.fn(),
  fetchSummary: vi.fn(),
}));

import { trackEvent, fetchSummary } from '@/services/analyticsService';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTrackEvent', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls trackEvent on mount when storeId is provided', () => {
    renderHook(() => useTrackEvent({ storeId: 'store123', eventType: 'view' }));
    expect(trackEvent).toHaveBeenCalledWith({
      storeId: 'store123',
      productId: null,
      eventType: 'view',
    });
  });

  it('passes productId when provided', () => {
    renderHook(() =>
      useTrackEvent({ storeId: 'store123', productId: 'prod456', eventType: 'click' })
    );
    expect(trackEvent).toHaveBeenCalledWith({
      storeId: 'store123',
      productId: 'prod456',
      eventType: 'click',
    });
  });

  it('does not call trackEvent when storeId is null', () => {
    renderHook(() => useTrackEvent({ storeId: null, eventType: 'view' }));
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it('calls trackEvent only once even across multiple re-renders', () => {
    const { rerender } = renderHook(() =>
      useTrackEvent({ storeId: 'store123', eventType: 'view' })
    );
    rerender();
    rerender();
    expect(trackEvent).toHaveBeenCalledTimes(1);
  });
});

describe('useAnalyticsSummary', () => {
  beforeEach(() => vi.clearAllMocks());

  it('is disabled and does not fetch when storeId is not provided', () => {
    const { result } = renderHook(() => useAnalyticsSummary(null), {
      wrapper: createWrapper(),
    });
    expect(result.current.data).toBeUndefined();
    expect(fetchSummary).not.toHaveBeenCalled();
  });

  it('fetches summary when storeId is provided', async () => {
    fetchSummary.mockResolvedValue({ data: { views: 42 } });
    const { result } = renderHook(() => useAnalyticsSummary('store123'), {
      wrapper: createWrapper(),
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSummary).toHaveBeenCalledWith('store123', {});
    expect(result.current.data).toEqual({ views: 42 });
  });

  it('passes extra params to fetchSummary', async () => {
    fetchSummary.mockResolvedValue({ data: { views: 5 } });
    const { result } = renderHook(
      () => useAnalyticsSummary('store123', { period: '7d' }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSummary).toHaveBeenCalledWith('store123', { period: '7d' });
  });
});
