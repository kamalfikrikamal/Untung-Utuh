import api from '@/utils/api';

export const storeService = {
  getMy: () => api.get('/stores/my').then((r) => r.data),
  getBySlug: (slug) => api.get(`/stores/${slug}`).then((r) => r.data),
};
