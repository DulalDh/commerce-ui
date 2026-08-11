import { api } from '../http';
import type { ShippingRatePayload, ShippingRateResult } from '@org/types';

export const shippingService = {
  calculateRate: (payload: ShippingRatePayload) => api.post<ShippingRateResult>('/shipping/rate', payload),
};
