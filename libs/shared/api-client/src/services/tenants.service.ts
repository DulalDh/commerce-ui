import { api } from '../http';
import type { StoreStatus, StoreProfilePayload } from '@org/types';

export const tenantsService = {
  storeStatus: () => api.get<StoreStatus>('/store/status'),
  updateProfile: (payload: StoreProfilePayload) => api.put('/store/profile', payload),
  updateTheme: (payload: FormData) => api.put('/store/theme-basic', payload),
  uploadKycDocument: (payload: FormData) => api.post('/store/kyc-documents', payload),
};
