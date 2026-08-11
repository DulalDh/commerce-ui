import { api } from '../http';
import type {
  StockInPayload,
  StockOutPayload,
  StockAdjustmentPayload,
  StockTransferPayload,
} from '@org/types';

export const inventoryService = {
  stockIn: (payload: StockInPayload) => api.post('/inventory/stock-in', payload),
  stockOut: (payload: StockOutPayload) => api.post('/inventory/stock-out', payload),
  adjustment: (payload: StockAdjustmentPayload) => api.post('/inventory/adjustment', payload),
  transfer: (payload: StockTransferPayload) => api.post('/inventory/transfer', payload),
};
