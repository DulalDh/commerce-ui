import { api } from '../http';
import type {
  LoginPayload,
  RegisterTenantPayload,
  RegisterUserPayload,
  AuthTokens,
  AuthUser,
} from '@org/types';

export type { LoginPayload, RegisterTenantPayload, RegisterUserPayload, AuthTokens, AuthUser };

export const authService = {
  login: (payload: LoginPayload) => api.post<AuthTokens>('/auth/login', payload),
  registerTenant: (payload: RegisterTenantPayload) => api.post<AuthTokens>('/tenants', payload),
  registerUser: (payload: RegisterUserPayload) => api.post<AuthTokens>('/auth/register', payload),
  refresh: (refreshToken: string) =>
    api.post<AuthTokens>('/auth/refresh', { refresh_token: refreshToken }),
  logout: () => api.post<void>('/auth/logout'),
  socialLoginUrl: (provider: 'google' | 'facebook') => `/auth/social/${provider}`,
};
