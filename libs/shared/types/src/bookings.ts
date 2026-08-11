import type { Address } from './common';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'assigned'
  | 'on the way'
  | 'started'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface Booking {
  id: string | number;
  service_id?: string | number;
  service_name?: string;
  scheduled_date: string;
  scheduled_slot_start?: string;
  scheduled_slot_end?: string;
  status: BookingStatus;
  address?: Address;
  notes?: string;
  is_emergency?: boolean;
}

export interface CreateBookingPayload {
  service_id: string | number;
  scheduled_date: string;
  scheduled_slot_start: string;
  scheduled_slot_end: string;
  address: Address;
  is_emergency?: boolean;
  notes?: string;
}

export interface Holiday {
  id: string | number;
  date: string;
  name: string;
}

export interface CalendarDay {
  date: string;
  bookings_count?: number;
  is_holiday?: boolean;
}
