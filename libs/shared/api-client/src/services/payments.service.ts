import { api } from '../http';
import type { InitiatePaymentPayload, PaymentResult } from '@org/types';

export const paymentsService = {
  initiate: (payload: InitiatePaymentPayload) => api.post<PaymentResult>('/payments/initiate', payload),
  confirmBankTransfer: (paymentId: string | number) => api.put(`/payments/${paymentId}/confirm`),
};
