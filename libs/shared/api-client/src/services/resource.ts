import { api } from '../http';

export interface ResourceService<TListItem, TDetail, TPayload> {
  list: (params?: Record<string, unknown>) => Promise<TListItem[]>;
  get: (id: string | number) => Promise<TDetail>;
  create: (payload: TPayload) => Promise<TDetail>;
  update: (id: string | number, payload: Partial<TPayload>) => Promise<TDetail>;
  remove: (id: string | number) => Promise<void>;
}

/**
 * Generic CRUD factory for straightforward REST resources. Modules with
 * non-standard actions (status transitions, webhooks, nested sub-resources)
 * layer extra functions on top of this in their own service file.
 */
export function resource<TListItem = unknown, TDetail = TListItem, TPayload = Partial<TDetail>>(
  basePath: string,
): ResourceService<TListItem, TDetail, TPayload> {
  return {
    list: (params) => api.get(basePath, { params }),
    get: (id) => api.get(`${basePath}/${id}`),
    create: (payload) => api.post(basePath, payload),
    update: (id, payload) => api.put(`${basePath}/${id}`, payload),
    remove: (id) => api.delete(`${basePath}/${id}`),
  };
}
