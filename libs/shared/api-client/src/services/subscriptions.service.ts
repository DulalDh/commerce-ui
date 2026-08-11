import { api } from '../http';
import { resource } from './resource';
import type { Plan, CurrentSubscription } from '@org/types';

export const plansService = resource<Plan>('/plans');
export const subscriptionsService = {
  subscribe: (payload: { plan_id: string | number }) => api.post('/subscriptions/subscribe', payload),
  current: () => api.get<CurrentSubscription>('/subscriptions/current'),
};
