import { api } from '../http';

export const inventoryService = {
  stockIn: (payload: Record<string, unknown>) => api.post('/inventory/stock-in', payload),
  stockOut: (payload: Record<string, unknown>) => api.post('/inventory/stock-out', payload),
  adjustment: (payload: Record<string, unknown>) => api.post('/inventory/adjustment', payload),
  transfer: (payload: Record<string, unknown>) => api.post('/inventory/transfer', payload),
};
