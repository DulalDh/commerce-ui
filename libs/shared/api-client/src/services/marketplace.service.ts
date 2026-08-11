import { api } from '../http';

export const marketplaceService = {
  search: (params: { q: string; type?: 'product' | 'service'; page?: number }) =>
    api.get('/search', { params }),
  queue: (params?: Record<string, unknown>) => api.get('/admin/marketplace/queue', { params }),
  approveListing: (productId: string | number) =>
    api.put(`/admin/marketplace/queue/${productId}/approve`),
  rejectListing: (productId: string | number, reason?: string) =>
    api.put(`/admin/marketplace/queue/${productId}/reject`, { reason }),
};
