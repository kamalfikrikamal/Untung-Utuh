import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/api', () => ({
  default: { get: vi.fn() },
}));

import api from '@/utils/api';
import { storeService } from '@/services/storeService';

describe('storeService', () => {
  beforeEach(() => vi.clearAllMocks());

  describe('getMy', () => {
    it('calls GET /stores/my and returns response data', async () => {
      const payload = { data: { store: { _id: '1', name: 'My Store' } } };
      api.get.mockResolvedValue({ data: payload });
      const result = await storeService.getMy();
      expect(api.get).toHaveBeenCalledWith('/stores/my');
      expect(result).toEqual(payload);
    });
  });

  describe('getBySlug', () => {
    it('calls GET /stores/:slug and returns response data', async () => {
      const payload = { data: { store: { _id: '1', slug: 'my-store' } } };
      api.get.mockResolvedValue({ data: payload });
      const result = await storeService.getBySlug('my-store');
      expect(api.get).toHaveBeenCalledWith('/stores/my-store');
      expect(result).toEqual(payload);
    });
  });
});
