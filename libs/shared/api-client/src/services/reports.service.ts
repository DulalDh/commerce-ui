import { api } from '../http';

export const reportsService = {
  adminDashboard: () => api.get('/admin/dashboard'),
  sales: (params?: Record<string, unknown>) => api.get('/reports/sales', { params }),
  bookings: (params?: Record<string, unknown>) => api.get('/reports/bookings', { params }),
  providerPerformance: (params?: Record<string, unknown>) =>
    api.get('/reports/provider-performance', { params }),
  topSelling: (params?: Record<string, unknown>) => api.get('/reports/top-selling', { params }),
};
