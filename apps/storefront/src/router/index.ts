import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@org/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../views/RegisterView.vue') },
    {
      path: '/products',
      name: 'products',
      component: () => import('../views/catalog/ProductListingView.vue'),
    },
    {
      path: '/products/:slug',
      name: 'product-detail',
      component: () => import('../views/catalog/ProductDetailView.vue'),
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('../views/search/SearchView.vue'),
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('../views/checkout/CheckoutView.vue'),
    },
    {
      path: '/checkout/payment',
      name: 'checkout-payment',
      component: () => import('../views/checkout/PaymentView.vue'),
    },
    {
      path: '/account/orders',
      name: 'account-orders',
      component: () => import('../views/account/AccountOrdersView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(authGuard);

export default router;
