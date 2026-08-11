import { api } from '../http';

export const cartService = {
  get: () => api.get('/cart'),
  addItem: (payload: Record<string, unknown>) => api.post('/cart', payload),
  updateItem: (cartItemId: string | number, payload: Record<string, unknown>) =>
    api.put(`/cart/items/${cartItemId}`, payload),
  removeItem: (cartItemId: string | number) => api.delete(`/cart/items/${cartItemId}`),
  checkout: (payload: Record<string, unknown>) => api.post('/checkout', payload),
};

export const ordersService = {
  list: (params?: Record<string, unknown>) => api.get('/orders', { params }),
  get: (orderId: string | number) => api.get(`/orders/${orderId}`),
  updateStatus: (orderId: string | number, status: string) =>
    api.put(`/orders/${orderId}/status`, { status }),
  createShipment: (orderId: string | number, payload: Record<string, unknown>) =>
    api.post(`/orders/${orderId}/shipments`, payload),
};
