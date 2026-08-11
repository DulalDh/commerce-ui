import { api } from '../http';

export const tenantsService = {
  storeStatus: () => api.get<Record<string, unknown>>('/store/status'),
  updateProfile: (payload: Record<string, unknown>) => api.put('/store/profile', payload),
  updateTheme: (payload: FormData) => api.put('/store/theme-basic', payload),
  uploadKycDocument: (payload: FormData) => api.post('/store/kyc-documents', payload),
};
