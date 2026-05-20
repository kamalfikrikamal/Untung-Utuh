import { useQuery } from '@tanstack/react-query';
import { storeService } from '@/services/storeService';

export function useMyStores() {
  return useQuery({
    queryKey: ['stores', 'my'],
    queryFn: storeService.getMy,
    select: (data) => data.data,
  });
}

export function useStoreBySlug(slug) {
  return useQuery({
    queryKey: ['stores', slug],
    queryFn: () => storeService.getBySlug(slug),
    enabled: !!slug,
    select: (data) => data.data,
  });
}
