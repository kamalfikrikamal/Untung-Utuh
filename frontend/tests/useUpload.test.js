import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUpload } from '@/hooks/useUpload';

vi.mock('@/utils/api', () => ({
  default: { post: vi.fn() },
}));

import api from '@/utils/api';

describe('useUpload', () => {
  beforeEach(() => vi.clearAllMocks());

  it('upload calls api.post with the correct endpoint and FormData', async () => {
    api.post.mockResolvedValue({ data: { data: { url: 'http://cdn.example.com/img.jpg' } } });
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const { result } = renderHook(() => useUpload());

    let uploadResult;
    await act(async () => {
      uploadResult = await result.current.upload(file);
    });

    expect(api.post).toHaveBeenCalledWith(
      '/upload',
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
        signal: expect.any(AbortSignal),
      })
    );
    expect(uploadResult).toEqual({ url: 'http://cdn.example.com/img.jpg' });
  });

  it('calls onProgress with percentage when e.total is available', async () => {
    api.post.mockImplementation((_url, _data, options) => {
      options.onUploadProgress({ loaded: 50, total: 100 });
      return Promise.resolve({ data: { data: {} } });
    });

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const onProgress = vi.fn();
    const { result } = renderHook(() => useUpload());

    await act(async () => {
      await result.current.upload(file, onProgress);
    });

    expect(onProgress).toHaveBeenCalledWith(50);
  });

  it('does not call onProgress when e.total is 0', async () => {
    api.post.mockImplementation((_url, _data, options) => {
      options.onUploadProgress({ loaded: 0, total: 0 });
      return Promise.resolve({ data: { data: {} } });
    });

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const onProgress = vi.fn();
    const { result } = renderHook(() => useUpload());

    await act(async () => {
      await result.current.upload(file, onProgress);
    });

    expect(onProgress).not.toHaveBeenCalled();
  });

  it('cancel aborts the ongoing upload', () => {
    const abortSpy = vi.spyOn(AbortController.prototype, 'abort');
    api.post.mockReturnValue(new Promise(() => {})); // Never resolves

    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    const { result } = renderHook(() => useUpload());

    // Start upload without awaiting — sets abortRef.current before first await
    result.current.upload(file);
    result.current.cancel();

    expect(abortSpy).toHaveBeenCalled();
    abortSpy.mockRestore();
  });
});
