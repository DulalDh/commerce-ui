import type { Tag } from './catalog';

export interface Customer {
  id: string | number;
  name: string;
  email: string;
  tags?: Tag[];
}

export interface CustomerNote {
  id: string | number;
  note: string;
  created_at?: string;
}

export interface Wallet {
  balance?: number;
  currency?: string;
}

export interface Loyalty {
  points?: number;
  tier?: string;
}
