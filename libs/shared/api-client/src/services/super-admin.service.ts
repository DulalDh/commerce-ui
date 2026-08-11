import { api } from '../http';
import type { Merchant } from '@org/types';

export const superAdminService = {
  listMerchants: (params?: Record<string, unknown>) => api.get<Merchant[]>('/admin/merchants', { params }),
  approveMerchant: (merchantId: string | number) => api.put(`/admin/merchants/${merchantId}/approve`),
  suspendMerchant: (merchantId: string | number) => api.put(`/admin/merchants/${merchantId}/suspend`),
  dashboard: () => api.get<Record<string, unknown>>('/admin/dashboard'),
};
