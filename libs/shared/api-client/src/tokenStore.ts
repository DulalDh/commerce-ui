const ACCESS_TOKEN_KEY = 'commerge-access-token';
const REFRESH_TOKEN_KEY = 'commerge-refresh-token';
const TENANT_ID_KEY = 'commerge-tenant-id';

export const tokenStore = {
  getAccessToken(): string | null {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  setAccessToken(token: string | null): void {
    if (token) window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
    else window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string | null): void {
    if (token) window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    else window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
  getTenantId(): string | null {
    return window.localStorage.getItem(TENANT_ID_KEY);
  },
  setTenantId(id: string | null): void {
    if (id) window.localStorage.setItem(TENANT_ID_KEY, id);
    else window.localStorage.removeItem(TENANT_ID_KEY);
  },
  clear(): void {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(TENANT_ID_KEY);
  },
};
