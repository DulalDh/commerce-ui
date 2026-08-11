import { api } from '../http';
import type { SearchResult, MarketplaceQueueItem } from '@org/types';

export const marketplaceService = {
  search: (params: { q: string; type?: 'product' | 'service'; page?: number }) =>
    api.get<SearchResult[]>('/search', { params }),
  queue: (params?: Record<string, unknown>) => api.get<MarketplaceQueueItem[]>('/admin/marketplace/queue', { params }),
  approveListing: (productId: string | number) =>
    api.put(`/admin/marketplace/queue/${productId}/approve`),
  rejectListing: (productId: string | number, reason?: string) =>
    api.put(`/admin/marketplace/queue/${productId}/reject`, { reason }),
};
