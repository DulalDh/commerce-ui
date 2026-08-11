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
      path: '/services',
      name: 'services',
      component: () => import('../views/services/ServiceListingView.vue'),
    },
    {
      path: '/services/:slug',
      name: 'service-detail',
      component: () => import('../views/services/ServiceDetailView.vue'),
      meta: { requiresAuth: true },
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
      path: '/account',
      name: 'account-dashboard',
      component: () => import('../views/account/AccountDashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/account/orders',
      name: 'account-orders',
      component: () => import('../views/account/AccountOrdersView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/account/bookings',
      name: 'account-bookings',
      component: () => import('../views/account/AccountBookingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/cms/BlogListView.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'blog-detail',
      component: () => import('../views/cms/BlogDetailView.vue'),
    },
    {
      path: '/faq',
      name: 'faq',
      component: () => import('../views/cms/FaqView.vue'),
    },
    {
      path: '/pages/:slug',
      name: 'cms-page',
      component: () => import('../views/cms/PageView.vue'),
    },
  ],
});

router.beforeEach(authGuard);

export default router;
