export interface StoreStatus {
  status?: 'pending' | 'approved' | 'suspended';
  [key: string]: unknown;
}

export interface StoreProfilePayload {
  description?: string;
  contact_email?: string;
  address?: { line1?: string; city?: string; country?: string };
}
