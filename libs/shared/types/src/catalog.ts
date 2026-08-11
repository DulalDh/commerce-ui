export interface Category {
  id: string | number;
  name: string;
  slug: string;
  parent_id?: string | number | null;
}

export interface Brand {
  id: string | number;
  name: string;
  slug: string;
}

export interface Tag {
  id: string | number;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string | number;
  url: string;
}

export interface ProductVariant {
  id?: string | number;
  name: string;
  price: number | null;
  attributes?: Record<string, unknown>;
}

export interface Product {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  description?: string;
  category_id?: string | number;
  brand_id?: string | number;
  status: 'draft' | 'published';
  tags?: Tag[];
  images?: ProductImage[];
  variants?: ProductVariant[];
  marketplace_status?: string;
  flash_sale_discount_percentage?: number;
  stock?: number;
}
