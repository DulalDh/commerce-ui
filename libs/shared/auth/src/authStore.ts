import { defineStore } from 'pinia';
import {
  authService,
  tokenStore,
  setRefreshHandler,
  type LoginPayload,
  type RegisterTenantPayload,
  type RegisterUserPayload,
} from '@org/api-client';

export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  tenant_id?: string | null;
  tenant_type?: 'merchant' | 'service_provider' | 'both' | null;
}

interface AuthState {
  user: AuthUser | null;
  initialized: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    roles: (state) => state.user?.roles ?? [],
    permissions: (state) => state.user?.permissions ?? [],
  },

  actions: {
    setSession(tokens: {
      access_token: string;
      refresh_token?: string;
      user?: Record<string, unknown>;
    }) {
      tokenStore.setAccessToken(tokens.access_token);
      if (tokens.refresh_token) tokenStore.setRefreshToken(tokens.refresh_token);
      if (tokens.user) {
        this.user = tokens.user as unknown as AuthUser;
        if (this.user.tenant_id) tokenStore.setTenantId(String(this.user.tenant_id));
      }
    },

    async login(payload: LoginPayload) {
      const tokens = await authService.login(payload);
      this.setSession(tokens);
      return tokens;
    },

    async registerTenant(payload: RegisterTenantPayload) {
      const tokens = await authService.registerTenant(payload);
      this.setSession(tokens);
      return tokens;
    },

    async registerUser(payload: RegisterUserPayload) {
      const tokens = await authService.registerUser(payload);
      this.setSession(tokens);
      return tokens;
    },

    async logout() {
      try {
        await authService.logout();
      } finally {
        tokenStore.clear();
        this.user = null;
      }
    },

    hasRole(role: string) {
      return this.roles.includes(role);
    },

    hasPermission(permission: string) {
      return this.permissions.includes(permission);
    },
  },
});

/** Wires the axios 401 refresh flow to this store; call once at app bootstrap. */
export function registerAuthRefreshHandler(store: ReturnType<typeof useAuthStore>) {
  setRefreshHandler(async () => {
    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) return null;
    try {
      const tokens = await authService.refresh(refreshToken);
      store.setSession(tokens);
      return tokens.access_token;
    } catch {
      return null;
    }
  });
}
