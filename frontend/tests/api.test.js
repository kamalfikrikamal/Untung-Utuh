import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('sonner', () => ({ toast: { error: vi.fn() } }));

import { toast } from 'sonner';
import api from '@/utils/api';

const reqHandlers = api.interceptors.request.handlers;
const resHandlers = api.interceptors.response.handlers;

describe('api interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('request interceptor', () => {
    it('attaches Authorization header when token exists', () => {
      localStorage.setItem('token', 'my-token');
      const config = { headers: {} };
      const result = reqHandlers[0].fulfilled(config);
      expect(result.headers.Authorization).toBe('Bearer my-token');
    });

    it('does not set Authorization header when no token', () => {
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

    it('clears token and redirects on 401', async () => {
      localStorage.setItem('token', 'expired-token');

      // Replace location with a plain writable object so href assignment is captured
      const originalLocation = globalThis.location;
      delete globalThis.location;
      globalThis.location = { href: '' };

      const error = { response: { status: 401 } };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);
      expect(localStorage.getItem('token')).toBeNull();
      expect(globalThis.location.href).toBe('/login');

      globalThis.location = originalLocation;
    });

    it('shows toast on 500 error', async () => {
      const error = { response: { status: 500 } };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);
      expect(toast.error).toHaveBeenCalledWith(
        'A server error occurred. Please try again.'
      );
    });

    it('shows toast on 503 error', async () => {
      const error = { response: { status: 503 } };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);
      expect(toast.error).toHaveBeenCalled();
    });

    it('does not show toast for 404 errors', async () => {
      const error = { response: { status: 404 } };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);
      expect(toast.error).not.toHaveBeenCalled();
    });

    it('handles errors with no response object', async () => {
      const error = { message: 'Network Error' };
      await expect(resHandlers[0].rejected(error)).rejects.toEqual(error);
      expect(toast.error).not.toHaveBeenCalled();
    });
  });
});
