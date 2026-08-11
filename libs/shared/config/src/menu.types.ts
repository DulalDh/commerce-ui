export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  permission?: string;
  tenantTypes?: Array<'merchant' | 'service_provider' | 'both'>;
  children?: MenuItem[];
}
