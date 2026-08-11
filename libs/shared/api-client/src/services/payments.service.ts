import { api } from '../http';

export const paymentsService = {
  initiate: (payload: Record<string, unknown>) => api.post('/payments/initiate', payload),
  confirmBankTransfer: (paymentId: string | number) => api.put(`/payments/${paymentId}/confirm`),
};
