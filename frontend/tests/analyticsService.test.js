import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

import api from '@/utils/api';
import { trackEvent, fetchSummary } from '@/services/analyticsService';

describe('analyticsService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('trackEvent', () => {
    it('calls api.post with correct payload', async () => {
      api.post.mockResolvedValueOnce({});
      await trackEvent({ storeId: 'store1', productId: 'p1', eventType: 'view' });
      expect(api.post).toHaveBeenCalledWith('/analytics/track', {
        storeId: 'store1',
        productId: 'p1',
        eventType: 'view',
      });
    });

    it('defaults productId to null', async () => {
      api.post.mockResolvedValueOnce({});
      await trackEvent({ storeId: 'store1', eventType: 'click' });
      expect(api.post).toHaveBeenCalledWith('/analytics/track', {
        storeId: 'store1',
        productId: null,
        eventType: 'click',
      });
    });

    it('silently swallows errors', async () => {
      api.post.mockRejectedValueOnce(new Error('network error'));
      await expect(
        trackEvent({ storeId: 'store1', eventType: 'view' })
      ).resolves.toBeUndefined();
    });
  });

  describe('fetchSummary', () => {
    it('returns response data', async () => {
      const mockData = { views: 42, clicks: 10 };
      api.get.mockResolvedValueOnce({ data: mockData });
      const result = await fetchSummary('store1', { granularity: 'daily' });
      expect(result).toEqual(mockData);
      expect(api.get).toHaveBeenCalledWith('/analytics/summary', {
        params: { storeId: 'store1', granularity: 'daily' },
      });
    });

    it('uses empty params by default', async () => {
      api.get.mockResolvedValueOnce({ data: {} });
      await fetchSummary('store1');
      expect(api.get).toHaveBeenCalledWith('/analytics/summary', {
        params: { storeId: 'store1' },
      });
    });
  });
});
