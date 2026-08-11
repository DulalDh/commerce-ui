import { api } from '../http';
import { resource } from './resource';

export const categoriesService = resource('/categories');
export const brandsService = resource('/brands');
export const tagsService = resource('/tags');
export const productsService = {
  ...resource('/products'),
  uploadImage: (productId: string | number, payload: FormData) =>
    api.post(`/products/${productId}/images`, payload),
  deleteImage: (productId: string | number, imageId: string | number) =>
    api.delete(`/products/${productId}/images/${imageId}`),
  addVariant: (productId: string | number, payload: Record<string, unknown>) =>
    api.post(`/products/${productId}/variants`, payload),
  deleteVariant: (productId: string | number, variantId: string | number) =>
    api.delete(`/products/${productId}/variants/${variantId}`),
  publishToMarketplace: (productId: string | number) =>
    api.put(`/products/${productId}/publish-to-marketplace`),
};
