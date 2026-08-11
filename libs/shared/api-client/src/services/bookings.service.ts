import { api } from '../http';
import { resource } from './resource';

export const bookingsService = {
  ...resource('/bookings'),
  accept: (bookingId: string | number) => api.put(`/bookings/${bookingId}/accept`),
  reject: (bookingId: string | number, reason?: string) =>
    api.put(`/bookings/${bookingId}/reject`, { reason }),
  assign: (bookingId: string | number, staffId: string | number) =>
    api.put(`/bookings/${bookingId}/assign`, { staff_id: staffId }),
  updateStatus: (bookingId: string | number, status: string) =>
    api.put(`/bookings/${bookingId}/status`, { status }),
};

export const providerCalendarService = {
  get: (tenantId: string | number, params?: Record<string, unknown>) =>
    api.get(`/providers/${tenantId}/calendar`, { params }),
};

export const holidaysService = resource('/holidays');
