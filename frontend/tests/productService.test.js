import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

import api from '@/utils/api';
import { productService } from '@/services/productService';

describe('productService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getAll calls GET /products with params', async () => {
    api.get.mockResolvedValueOnce({ data: { products: [] } });
    const result = await productService.getAll({ store: 'store1' });
    expect(api.get).toHaveBeenCalledWith('/products', { params: { store: 'store1' } });
    expect(result).toEqual({ products: [] });
  });

  it('getById calls GET /products/:id', async () => {
    api.get.mockResolvedValueOnce({ data: { _id: 'p1' } });
    const result = await productService.getById('p1');
    expect(api.get).toHaveBeenCalledWith('/products/p1');
    expect(result).toEqual({ _id: 'p1' });
  });

  it('create calls POST /products', async () => {
    api.post.mockResolvedValueOnce({ data: { _id: 'new1' } });
    const result = await productService.create({ name: 'Widget' });
    expect(api.post).toHaveBeenCalledWith('/products', { name: 'Widget' });
    expect(result).toEqual({ _id: 'new1' });
  });

  it('update calls PATCH /products/:id', async () => {
    api.patch.mockResolvedValueOnce({ data: { _id: 'p1', name: 'Updated' } });
    const result = await productService.update('p1', { name: 'Updated' });
    expect(api.patch).toHaveBeenCalledWith('/products/p1', { name: 'Updated' });
    expect(result).toEqual({ _id: 'p1', name: 'Updated' });
  });

  it('remove calls DELETE /products/:id', async () => {
    api.delete.mockResolvedValueOnce({ data: { message: 'deleted' } });
    const result = await productService.remove('p1');
    expect(api.delete).toHaveBeenCalledWith('/products/p1');
    expect(result).toEqual({ message: 'deleted' });
  });

  it('uploadImages sends files as FormData to POST /products/images', async () => {
    api.post.mockResolvedValueOnce({ data: { images: [{ url: 'https://cdn/a.jpg' }] } });
    const files = [new File(['img'], 'a.jpg', { type: 'image/jpeg' })];
    const result = await productService.uploadImages(files);

    expect(api.post).toHaveBeenCalledTimes(1);
    const [url, body] = api.post.mock.calls[0];
    expect(url).toBe('/products/images');
    expect(body).toBeInstanceOf(FormData);
    expect(result).toEqual({ images: [{ url: 'https://cdn/a.jpg' }] });
  });
});
