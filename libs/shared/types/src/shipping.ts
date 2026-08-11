export interface ShippingRatePayload {
  provider: string;
  origin: string;
  destination: string;
  weight_kg: number;
}

export interface ShippingRateResult {
  rate?: number;
  amount?: number;
}
