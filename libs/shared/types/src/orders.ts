import type { Address } from './common';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface CartItem {
  id: string | number;
  product_id: string | number;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export interface OrderItem {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string | number;
  reference?: string;
  status: OrderStatus;
  total: number;
  shipping_address?: Address;
  items?: OrderItem[];
  created_at?: string;
}

export interface CheckoutPayload {
  shipping_address: Address;
  coupon_code?: string;
}
