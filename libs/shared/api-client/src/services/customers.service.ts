import { api } from '../http';

export const customersService = {
  list: (params?: Record<string, unknown>) => api.get('/customers', { params }),
  get: (customerId: string | number) => api.get(`/customers/${customerId}`),
  addNote: (customerId: string | number, payload: Record<string, unknown>) =>
    api.post(`/customers/${customerId}/notes`, payload),
  listNotes: (customerId: string | number) => api.get(`/customers/${customerId}/notes`),
  syncTags: (customerId: string | number, tagIds: (string | number)[]) =>
    api.put(`/customers/${customerId}/tags`, { tags: tagIds }),
};

export const accountService = {
  orders: () => api.get('/account/orders'),
  bookings: () => api.get('/account/bookings'),
  wallet: () => api.get('/account/wallet'),
  loyalty: () => api.get('/account/loyalty'),
};
