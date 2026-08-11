export interface Merchant {
  id: string | number;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'suspended';
}

export interface MarketplaceQueueItem {
  id: string | number;
  name: string;
  type?: 'product' | 'service';
  tenant_name?: string;
}

export interface SearchResult {
  id: string | number;
  name: string;
  slug?: string;
  type: 'product' | 'service';
  price?: number;
}
