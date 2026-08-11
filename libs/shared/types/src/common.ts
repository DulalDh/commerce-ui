export interface Address {
  line1: string;
  city: string;
  country?: string;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}
