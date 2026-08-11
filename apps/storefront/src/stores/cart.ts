import { defineStore } from 'pinia';
import { cartService } from '@org/api-client';

interface CartItem {
  id: string | number;
  product_id: string | number;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
  drawerOpen: boolean;
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    loading: false,
    drawerOpen: false,
  }),

  getters: {
    itemCount: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  },

  actions: {
    openDrawer() {
      this.drawerOpen = true;
      this.refresh();
    },

    closeDrawer() {
      this.drawerOpen = false;
    },

    async refresh() {
      this.loading = true;
      try {
        const cart = (await cartService.get()) as unknown as { items: CartItem[] };
        this.items = cart.items ?? [];
      } finally {
        this.loading = false;
      }
    },

    async addItem(payload: { product_id: string | number; variant_id?: string | number; quantity: number }) {
      await cartService.addItem(payload);
      await this.refresh();
    },

    async updateQuantity(cartItemId: string | number, quantity: number) {
      await cartService.updateItem(cartItemId, { quantity });
      await this.refresh();
    },

    async removeItem(cartItemId: string | number) {
      await cartService.removeItem(cartItemId);
      await this.refresh();
    },
  },
});
