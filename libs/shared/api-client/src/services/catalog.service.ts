import { api } from '../http';
import { resource } from './resource';
import type { Category, Brand, Tag, Product, ProductVariant } from '@org/types';

export const categoriesService = resource<Category>('/categories');
export const brandsService = resource<Brand>('/brands');
export const tagsService = resource<Tag>('/tags');
export const productsService = {
  ...resource<Product>('/products'),
  uploadImage: (productId: string | number, payload: FormData) =>
    api.post(`/products/${productId}/images`, payload),
  deleteImage: (productId: string | number, imageId: string | number) =>
    api.delete(`/products/${productId}/images/${imageId}`),
  setPrimaryImage: (productId: string | number, imageId: string | number) =>
    api.patch(`/products/${productId}/images/${imageId}/primary`, {}),
  addVariant: (productId: string | number, payload: Partial<ProductVariant>) =>
    api.post<ProductVariant>(`/products/${productId}/variants`, payload),
  deleteVariant: (productId: string | number, variantId: string | number) =>
    api.delete(`/products/${productId}/variants/${variantId}`),
  publishToMarketplace: (productId: string | number) =>
    api.put(`/products/${productId}/publish-to-marketplace`),
};

/**
 * Anonymous storefront browsing. Backed by /storefront/* - unauthenticated,
 * published-products-only, tenant resolved from the X-Tenant-ID header
 * (see ResolveTenant::allowsPublicTenantHeader on the backend). Distinct
 * from productsService/categoriesService above, which require a logged-in
 * tenant-admin session and include drafts.
 */
export const storefrontCatalogService = {
  products: {
    list: (params?: Record<string, unknown>): Promise<Product[]> =>
      api.get('/storefront/products', { params }),
    get: (slug: string): Promise<Product> => api.get(`/storefront/products/${slug}`),
  },
  categories: {
    list: (): Promise<Category[]> => api.get('/storefront/categories'),
  },
  brands: {
    list: (): Promise<Brand[]> => api.get('/storefront/brands'),
  },
  tags: {
    list: (): Promise<Tag[]> => api.get('/storefront/tags'),
  },
};
