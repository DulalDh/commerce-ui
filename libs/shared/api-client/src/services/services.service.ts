import { api } from '../http';
import { resource } from './resource';
import type {
  ProviderProfile,
  ServiceCategory,
  Service,
  Staff,
  StaffLeave,
  Vehicle,
} from '@org/types';

export const providerService = {
  getProfile: () => api.get<ProviderProfile>('/provider/profile'),
  updateProfile: (payload: ProviderProfile) => api.put('/provider/profile', payload),
  uploadCertificate: (payload: FormData) => api.post('/provider/certificates', payload),
};

export const serviceCategoriesService = resource<ServiceCategory>('/service-categories');
export const servicesService = resource<Service>('/services');

export const staffService = {
  ...resource<Staff>('/staff'),
  listLeaves: (staffId: string | number) => api.get<StaffLeave[]>(`/staff/${staffId}/leaves`),
  createLeave: (staffId: string | number, payload: Omit<StaffLeave, 'id'>) =>
    api.post<StaffLeave>(`/staff/${staffId}/leaves`, payload),
  deleteLeave: (staffId: string | number, leaveId: string | number) =>
    api.delete(`/staff/${staffId}/leaves/${leaveId}`),
  schedule: (staffId: string | number) => api.get(`/staff/${staffId}/schedule`),
};

export const vehiclesService = resource<Vehicle>('/vehicles');
