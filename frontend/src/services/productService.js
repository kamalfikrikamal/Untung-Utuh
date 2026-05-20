import api from '@/utils/api';

export const productService = {
  getAll: (params) => api.get('/products', { params }).then((r) => r.data),
  getById: (id) => api.get(`/products/${id}`).then((r) => r.data),
  create: (data) => api.post('/products', data).then((r) => r.data),
  update: (id, data) => api.patch(`/products/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
  uploadImages: (files) => {
    const form = new FormData();
    files.forEach((f) => form.append('images', f));
    return api.post('/products/images', form).then((r) => r.data);
  },
};
