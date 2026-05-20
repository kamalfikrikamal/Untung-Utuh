import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { productService } from '@/services/productService';

export const PRODUCTS_KEY = 'products';

export function useProducts(params) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, params],
    queryFn: () => productService.getAll(params),
    enabled: params !== null,
    select: (data) => data.data,
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: [PRODUCTS_KEY, id],
    queryFn: () => productService.getById(id),
    enabled: !!id,
    select: (data) => data.data.product,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success('Product created successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create product');
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success('Product updated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update product');
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: productService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_KEY] });
      toast.success('Product deactivated successfully');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete product');
    },
  });
}

export function useUploadProductImages() {
  return useMutation({
    mutationFn: productService.uploadImages,
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to upload images');
    },
  });
}

/**
 * Infinite-scroll variant — each page is one API response.
 * Flatten pages with: data.pages.flatMap(p => p.data.products)
 */
export function useInfiniteProducts(params, limit = 20) {
  return useInfiniteQuery({
    queryKey: [PRODUCTS_KEY, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      productService.getAll({ ...params, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.data.pagination;
      return page < pages ? page + 1 : undefined;
    },
    enabled: params !== null,
  });
}
