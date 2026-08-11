export interface Coupon {
  id: string | number;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  max_discount?: number;
}

export interface FlashSale {
  id: string | number;
  name: string;
  discount_percentage: number;
  starts_at: string;
  ends_at: string;
  product_ids?: (string | number)[];
}

export interface PromotionRule {
  id: string | number;
  name: string;
  type: 'bogo' | 'bundle';
  config?: Record<string, unknown>;
}
