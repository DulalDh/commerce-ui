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

export interface ProductImageVariants {
  original: string;
  large: string;
  medium: string;
  small: string;
  thumbnail: string;
}

export interface ProductImage {
  id: string | number;
  url: string;
  is_primary?: boolean;
  variants?: ProductImageVariants;
}

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Cpath d="M30 65l15-18 12 14 8-10 15 14v5H30z" fill="%23a3a3a3"/%3E%3Ccircle cx="40" cy="38" r="7" fill="%23a3a3a3"/%3E%3C/svg%3E';

export function getFeatureImage(images?: ProductImage[]): ProductImage | undefined {
  if (!images?.length) return undefined;
  return images.find((image) => image.is_primary) ?? images[0];
}

export function getImageVariant(
  image: ProductImage | undefined,
  size: keyof ProductImageVariants,
): string {
  if (!image) return PLACEHOLDER_IMAGE;
  return image.variants?.[size] ?? image.url;
}

export function getFeatureImageUrl(
  images: ProductImage[] | undefined,
  size: keyof ProductImageVariants,
): string {
  return getImageVariant(getFeatureImage(images), size);
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
