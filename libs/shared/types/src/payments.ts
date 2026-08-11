export type PaymentGateway =
  | 'cod'
  | 'bank_transfer'
  | 'sslcommerz'
  | 'bkash'
  | 'nagad'
  | 'rocket'
  | 'stripe'
  | 'paypal';

export interface InitiatePaymentPayload {
  order_id: string | number;
  gateway: PaymentGateway;
}

export interface PaymentResult {
  id?: string | number;
  status?: string;
  redirect_url?: string;
}
