import { api } from '../http';
import type { Review, CreateReviewPayload } from '@org/types';

export const reviewsService = {
  list: (params?: Record<string, unknown>) => api.get<Review[]>('/reviews', { params }),
  createForBooking: (bookingId: string | number, payload: CreateReviewPayload) =>
    api.post<Review>(`/bookings/${bookingId}/reviews`, payload),
};
