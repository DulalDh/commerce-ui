import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '@org/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    { path: '/forbidden', name: 'forbidden', component: () => import('../views/ForbiddenView.vue') },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true, roles: ['super-admin'] },
    },
    {
      path: '/merchants',
      name: 'merchants',
      component: () => import('../views/merchants/MerchantsView.vue'),
      meta: { requiresAuth: true, roles: ['super-admin'] },
    },
    {
      path: '/marketplace/queue',
      name: 'marketplace-queue',
      component: () => import('../views/marketplace/MarketplaceQueueView.vue'),
      meta: { requiresAuth: true, roles: ['super-admin'] },
    },
    {
      path: '/plans',
      name: 'plans',
      component: () => import('../views/plans/PlansView.vue'),
      meta: { requiresAuth: true, roles: ['super-admin'] },
    },
    {
      path: '/rbac/roles',
      name: 'rbac-roles',
      component: () => import('../views/rbac/RolesView.vue'),
      meta: { requiresAuth: true, roles: ['super-admin'] },
    },
    {
      path: '/rbac/permissions',
      name: 'rbac-permissions',
      component: () => import('../views/rbac/PermissionsView.vue'),
      meta: { requiresAuth: true, roles: ['super-admin'] },
    },
  ],
});

router.beforeEach(authGuard);

export default router;
