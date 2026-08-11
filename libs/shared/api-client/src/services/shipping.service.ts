import { api } from '../http';

export const shippingService = {
  calculateRate: (payload: Record<string, unknown>) => api.post('/shipping/rate', payload),
};
