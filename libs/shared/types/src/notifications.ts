export interface Notification {
  id: string | number;
  title?: string;
  message?: string;
  read_at?: string | null;
  created_at?: string;
}

export interface NotificationTemplate {
  id: string | number;
  event_type: string;
  channel: 'email' | 'sms' | 'push';
  subject: string;
  body?: string;
  is_active: boolean;
}
