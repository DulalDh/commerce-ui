import { api } from '../http';
import type { Cart, Order, CheckoutPayload } from '@org/types';

export const cartService = {
  get: () => api.get<Cart>('/cart'),
  addItem: (payload: { product_id: string | number; variant_id?: string | number; quantity: number }) =>
    api.post('/cart', payload),
  updateItem: (cartItemId: string | number, payload: { quantity: number }) =>
    api.put(`/cart/items/${cartItemId}`, payload),
  removeItem: (cartItemId: string | number) => api.delete(`/cart/items/${cartItemId}`),
  checkout: (payload: CheckoutPayload) => api.post<Order>('/checkout', payload),
};

export const ordersService = {
  list: (params?: Record<string, unknown>) => api.get<Order[]>('/orders', { params }),
  get: (orderId: string | number) => api.get<Order>(`/orders/${orderId}`),
  updateStatus: (orderId: string | number, status: string) =>
    api.put<Order>(`/orders/${orderId}/status`, { status }),
  createShipment: (orderId: string | number, payload: { provider: string }) =>
    api.post(`/orders/${orderId}/shipments`, payload),
};
