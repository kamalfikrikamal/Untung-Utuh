import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('@/utils/storage', () => ({
  storage: {
    getToken: vi.fn(),
    clearToken: vi.fn(),
    setToken: vi.fn(),
  },
}));

import { toast } from 'sonner';
import { storage } from '@/utils/storage';
import { api } from '@/services/api';

const reqHandlers = api.interceptors.request.handlers;
const resHandlers = api.interceptors.response.handlers;

describe('services/api interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('request interceptor', () => {
    it('attaches Authorization header when token exists', () => {
      storage.getToken.mockReturnValue('test-token');
      const config = { headers: {} };
      const result = reqHandlers[0].fulfilled(config);
      expect(result.headers.Authorization).toBe('Bearer test-token');
    });

    it('does not set Authorization when no token', () => {
      storage.getToken.mockReturnValue(null);
      const config = { headers: {} };
      const result = reqHandlers[0].fulfilled(config);
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('rejects on request setup error', async () => {
      const err = new Error('setup fail');
      await expect(reqHandlers[0].rejected(err)).rejects.toThrow('setup fail');
    });
  });

  describe('response interceptor', () => {
    it('passes successful response through', () => {
      const res = { data: 'ok', status: 200 };
      expect(resHandlers[0].fulfilled(res)).toBe(res);
    });

    it('clears token, shows toast, and redirects on 401', async () => {
      delete globalThis.location;
      globalThis.location = { pathname: '/dashboard', href: '' };

      const error = { response: { status: 401, data: {} } };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);

      expect(storage.clearToken).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalled();
      expect(globalThis.location.href).toBe('/login');
    });

    it('clears token and redirects on 403', async () => {
      delete globalThis.location;
      globalThis.location = { pathname: '/dashboard', href: '' };

      const error = { response: { status: 403, data: {} } };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);

      expect(storage.clearToken).toHaveBeenCalled();
      expect(globalThis.location.href).toBe('/login');
    });

    it('does not redirect when already on /login', async () => {
      delete globalThis.location;
      globalThis.location = { pathname: '/login', href: '' };

      const error = { response: { status: 401, data: {} } };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);
      expect(globalThis.location.href).toBe('');
    });

    it('shows response error message on other 4xx/5xx errors', async () => {
      const error = { response: { status: 500, data: { message: 'Internal server error' } } };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);
      expect(toast.error).toHaveBeenCalledWith('Internal server error');
    });

    it('shows fallback message when no response message', async () => {
      const error = { response: { status: 422, data: {} } };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);
      expect(toast.error).toHaveBeenCalledWith('An unexpected error occurred');
    });

    it('shows network error when no response object', async () => {
      const error = { message: 'Network Error' };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);
      expect(toast.error).toHaveBeenCalledWith('Network error. Please check your connection.');
    });
  });
});
