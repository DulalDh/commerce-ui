import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@org/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('../views/ForbiddenView.vue'),
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/store',
      name: 'store',
      component: () => import('../views/store/StoreView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/categories',
      name: 'catalog-categories',
      component: () => import('../views/catalog/CategoriesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/brands',
      name: 'catalog-brands',
      component: () => import('../views/catalog/BrandsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/tags',
      name: 'catalog-tags',
      component: () => import('../views/catalog/TagsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/products',
      name: 'catalog-products',
      component: () => import('../views/catalog/ProductsListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/catalog/products/:id',
      name: 'catalog-product-form',
      component: () => import('../views/catalog/ProductFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: () => import('../views/inventory/InventoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('../views/orders/OrdersListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/orders/:id',
      name: 'order-detail',
      component: () => import('../views/orders/OrderDetailView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('../views/customers/CustomersListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customers/:id',
      name: 'customer-detail',
      component: () => import('../views/customers/CustomerDetailView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach(authGuard);

export default router;
