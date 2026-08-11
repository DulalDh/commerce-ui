export interface AuthUser {
  id: string | number;
  name: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  tenant_id?: string | null;
  tenant_type?: 'merchant' | 'service_provider' | 'both' | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterTenantPayload {
  tenant: { name: string; type: string };
  owner: { name: string; email: string; password: string };
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthTokens {
  /** Sanctum personal access token ("id|plaintext"); no refresh mechanism. */
  token: string;
  user?: AuthUser;
}
