import type { NavigationGuard } from 'vue-router';
import { useAuthStore } from './authStore';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    roles?: string[];
  }
}

export const authGuard: NavigationGuard = (to) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.meta.roles?.length && !to.meta.roles.some((role) => auth.hasRole(role))) {
    return { name: 'forbidden' };
  }

  return true;
};
