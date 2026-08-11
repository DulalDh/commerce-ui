import { api } from '../http';

export const superAdminService = {
  listMerchants: (params?: Record<string, unknown>) => api.get('/admin/merchants', { params }),
  approveMerchant: (merchantId: string | number) => api.put(`/admin/merchants/${merchantId}/approve`),
  suspendMerchant: (merchantId: string | number) => api.put(`/admin/merchants/${merchantId}/suspend`),
  dashboard: () => api.get('/admin/dashboard'),
};
