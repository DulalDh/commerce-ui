import { api } from '../http';
import { resource } from './resource';

export const notificationsService = {
  list: (params?: Record<string, unknown>) => api.get('/notifications', { params }),
  markAsRead: (notificationId: string | number) => api.put(`/notifications/${notificationId}/read`),
};

export const notificationTemplatesService = resource('/admin/notification-templates');
