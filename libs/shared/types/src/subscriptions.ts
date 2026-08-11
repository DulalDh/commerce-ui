export interface Plan {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  limits?: { products?: number; staff?: number };
}

export interface CurrentSubscription {
  plan?: Plan;
  status?: string;
}
