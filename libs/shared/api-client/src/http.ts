import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { tokenStore } from './tokenStore';

export interface ApiEnvelope<T> {
  success?: boolean;
  message?: string;
  data: T;
  meta?: Record<string, unknown>;
}

export class ApiError extends Error {
  status?: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status?: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

let baseURL = '/api';

export function configureApiClient(options: { baseURL: string }) {
  baseURL = options.baseURL;
  http.defaults.baseURL = baseURL;
}

export const http = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  const tenantId = tokenStore.getTenantId();
  if (tenantId) {
    config.headers = config.headers ?? {};
    config.headers['X-Tenant-ID'] = tenantId;
  }
  return config;
});

type RefreshHandler = () => Promise<string | null>;
let refreshHandler: RefreshHandler | null = null;
let refreshingPromise: Promise<string | null> | null = null;

export function setRefreshHandler(handler: RefreshHandler) {
  refreshHandler = handler;
}

http.interceptors.response.use(
  // Unwraps the backend's ApiResponse envelope so callers receive the
  // payload directly; the AxiosResponse return type is a lie we accept
  // because every service function's generic overrides it anyway.
  (response) => {
    const body = response.data as ApiEnvelope<unknown> | unknown;
    if (body && typeof body === 'object' && 'data' in (body as Record<string, unknown>)) {
      return (body as ApiEnvelope<unknown>).data as unknown as AxiosResponse;
    }
    return body as AxiosResponse;
  },
  async (error: AxiosError<{ message?: string; errors?: Record<string, string[]> }>) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && refreshHandler && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (!refreshingPromise) {
          refreshingPromise = refreshHandler().finally(() => {
            refreshingPromise = null;
          });
        }
        const newToken = await refreshingPromise;
        if (newToken) {
          originalRequest.headers = originalRequest.headers ?? {};
          (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
          return http.request(originalRequest);
        }
      } catch {
        tokenStore.clear();
      }
    }

    const message = error.response?.data?.message ?? error.message ?? 'Request failed';
    throw new ApiError(message, error.response?.status, error.response?.data?.errors);
  },
);

/**
 * Typed wrapper around `http` — the response interceptor above unwraps the
 * envelope at runtime so every call actually resolves with `T`, not
 * `AxiosResponse<T>`; axios's own typings can't express that, hence the cast.
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    http.get(url, config) as unknown as Promise<T>,
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    http.post(url, data, config) as unknown as Promise<T>,
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> =>
    http.put(url, data, config) as unknown as Promise<T>,
  delete: <T>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    http.delete(url, config) as unknown as Promise<T>,
};
