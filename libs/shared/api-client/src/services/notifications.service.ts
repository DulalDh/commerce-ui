import { api } from '../http';
import { resource } from './resource';
import type { Notification, NotificationTemplate } from '@org/types';

export const notificationsService = {
  list: (params?: Record<string, unknown>) => api.get<Notification[]>('/notifications', { params }),
  markAsRead: (notificationId: string | number) => api.put(`/notifications/${notificationId}/read`),
};

export const notificationTemplatesService = resource<NotificationTemplate>('/admin/notification-templates');
