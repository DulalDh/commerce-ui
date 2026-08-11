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
  addVariant: (productId: string | number, payload: Partial<ProductVariant>) =>
    api.post<ProductVariant>(`/products/${productId}/variants`, payload),
  deleteVariant: (productId: string | number, variantId: string | number) =>
    api.delete(`/products/${productId}/variants/${variantId}`),
  publishToMarketplace: (productId: string | number) =>
    api.put(`/products/${productId}/publish-to-marketplace`),
};
