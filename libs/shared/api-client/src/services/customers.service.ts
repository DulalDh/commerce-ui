import { api } from '../http';
import type { Customer, CustomerNote, Wallet, Loyalty, Order, Booking } from '@org/types';

export const customersService = {
  list: (params?: Record<string, unknown>) => api.get<Customer[]>('/customers', { params }),
  get: (customerId: string | number) => api.get<Customer>(`/customers/${customerId}`),
  addNote: (customerId: string | number, payload: { note: string }) =>
    api.post<CustomerNote>(`/customers/${customerId}/notes`, payload),
  listNotes: (customerId: string | number) => api.get<CustomerNote[]>(`/customers/${customerId}/notes`),
  syncTags: (customerId: string | number, tagIds: (string | number)[]) =>
    api.put(`/customers/${customerId}/tags`, { tag_ids: tagIds }),
};

export const accountService = {
  orders: () => api.get<Order[]>('/account/orders'),
  bookings: () => api.get<Booking[]>('/account/bookings'),
  wallet: () => api.get<Wallet>('/account/wallet'),
  loyalty: () => api.get<Loyalty>('/account/loyalty'),
};
