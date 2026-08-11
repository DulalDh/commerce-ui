import { api } from '../http';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterTenantPayload {
  tenant: Record<string, unknown>;
  owner: Record<string, unknown>;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  user?: Record<string, unknown>;
}

export const authService = {
  login: (payload: LoginPayload) => api.post<AuthTokens>('/auth/login', payload),
  registerTenant: (payload: RegisterTenantPayload) => api.post<AuthTokens>('/tenants', payload),
  registerUser: (payload: RegisterUserPayload) => api.post<AuthTokens>('/auth/register', payload),
  refresh: (refreshToken: string) =>
    api.post<AuthTokens>('/auth/refresh', { refresh_token: refreshToken }),
  logout: () => api.post<void>('/auth/logout'),
  socialLoginUrl: (provider: 'google' | 'facebook') => `/auth/social/${provider}`,
};
