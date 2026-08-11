export interface ProviderProfile {
  years_experience?: number;
  service_area?: { cities?: string[]; radius_km?: number };
}

export interface ServiceCategory {
  id: string | number;
  name: string;
  slug: string;
  parent_id?: string | number | null;
  is_active?: boolean;
}

export interface Service {
  id: string | number;
  name: string;
  slug: string;
  description?: string;
  service_category_id?: string | number;
  pricing_model: 'fixed' | 'hourly' | 'quote';
  price: number;
  duration_minutes?: number;
  service_area?: string[];
  required_equipment?: string[];
  cancellation_policy?: string;
  status: 'draft' | 'published';
  flash_sale_discount_percentage?: number;
}

export interface Staff {
  id: string | number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
}

export interface StaffLeave {
  id: string | number;
  starts_on: string;
  ends_on: string;
  reason?: string;
}

export interface Vehicle {
  id: string | number;
  staff_id?: string | number;
  type: string;
  registration_number: string;
  capacity_kg?: number;
  is_active: boolean;
}
