import { defineStore } from 'pinia';
import {
  authService,
  tokenStore,
  setRefreshHandler,
  type LoginPayload,
  type RegisterTenantPayload,
  type RegisterUserPayload,
  type AuthTokens,
  type AuthUser,
} from '@org/api-client';

export type { AuthUser };

interface AuthState {
  user: AuthUser | null;
  initialized: boolean;
}

export const useAuthStore = defineStore('auth', {
  // Rehydrates from localStorage so a hard reload doesn't bounce an
  // otherwise-still-logged-in user back to the login screen — the access
  // token alone isn't enough since `isAuthenticated` is derived from `user`.
  state: (): AuthState => ({
    user: tokenStore.getAccessToken() ? tokenStore.getUser<AuthUser>() : null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    roles: (state) => state.user?.roles ?? [],
    permissions: (state) => state.user?.permissions ?? [],
  },

  actions: {
    setSession(tokens: AuthTokens) {
      tokenStore.setAccessToken(tokens.token);
      if (tokens.user) {
        this.user = tokens.user;
        tokenStore.setUser(this.user);
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

/**
 * Wires the axios 401 refresh flow to this store; call once at app bootstrap.
 * The current backend issues Sanctum personal access tokens with no refresh
 * mechanism, so this only does anything if a future backend version starts
 * returning a refresh token; today `getRefreshToken()` is always null and
 * the handler is a no-op.
 */
export function registerAuthRefreshHandler(store: ReturnType<typeof useAuthStore>) {
  setRefreshHandler(async () => {
    const refreshToken = tokenStore.getRefreshToken();
    if (!refreshToken) return null;
    try {
      const tokens = await authService.refresh(refreshToken);
      store.setSession(tokens);
      return tokens.token;
    } catch {
      return null;
    }
  });
}
