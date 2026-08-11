import { api } from '../http';
import { resource } from './resource';

export const providerService = {
  getProfile: () => api.get('/provider/profile'),
  updateProfile: (payload: Record<string, unknown>) => api.put('/provider/profile', payload),
  uploadCertificate: (payload: FormData) => api.post('/provider/certificates', payload),
};

export const serviceCategoriesService = resource('/service-categories');
export const servicesService = resource('/services');

export const staffService = {
  ...resource('/staff'),
  listLeaves: (staffId: string | number) => api.get(`/staff/${staffId}/leaves`),
  createLeave: (staffId: string | number, payload: Record<string, unknown>) =>
    api.post(`/staff/${staffId}/leaves`, payload),
  deleteLeave: (staffId: string | number, leaveId: string | number) =>
    api.delete(`/staff/${staffId}/leaves/${leaveId}`),
  schedule: (staffId: string | number) => api.get(`/staff/${staffId}/schedule`),
};

export const vehiclesService = resource('/vehicles');
