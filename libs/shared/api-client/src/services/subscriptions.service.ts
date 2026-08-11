import { api } from '../http';
import { resource } from './resource';

export const plansService = resource('/plans');
export const subscriptionsService = {
  subscribe: (payload: Record<string, unknown>) => api.post('/subscriptions/subscribe', payload),
  current: () => api.get('/subscriptions/current'),
};
