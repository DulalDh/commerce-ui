export interface StockInPayload {
  product_id: string | number;
  quantity: number;
  notes?: string;
}

export interface StockOutPayload {
  product_id: string | number;
  quantity: number;
  notes?: string;
}

export interface StockAdjustmentPayload {
  product_id: string | number;
  delta: number;
  notes?: string;
}

export interface StockTransferPayload {
  from_product_id: string | number;
  to_product_id: string | number;
  to_variant_id?: string | number;
  quantity: number;
  notes?: string;
}
