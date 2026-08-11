import { api } from '../http';

export const reviewsService = {
  list: (params?: Record<string, unknown>) => api.get('/reviews', { params }),
  createForBooking: (bookingId: string | number, payload: Record<string, unknown>) =>
    api.post(`/bookings/${bookingId}/reviews`, payload),
};
