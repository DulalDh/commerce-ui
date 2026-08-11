import { api } from '../http';
import { resource } from './resource';
import type { Booking, Holiday, CalendarDay } from '@org/types';

export const bookingsService = {
  ...resource<Booking>('/bookings'),
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
    api.get<CalendarDay[] | { days: CalendarDay[] }>(`/providers/${tenantId}/calendar`, { params }),
};

export const holidaysService = resource<Holiday>('/holidays');
