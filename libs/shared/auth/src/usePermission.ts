import { computed } from 'vue';
import { useAuthStore } from './authStore';

export function usePermission() {
  const auth = useAuthStore();

  function can(permission: string) {
    return auth.hasPermission(permission);
  }

  function canAny(permissions: string[]) {
    return permissions.some((p) => auth.hasPermission(p));
  }

  function is(role: string) {
    return auth.hasRole(role);
  }

  return {
    can,
    canAny,
    is,
    roles: computed(() => auth.roles),
    permissions: computed(() => auth.permissions),
  };
}
