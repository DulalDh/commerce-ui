import type { MenuItem } from './menu.types';

export interface MenuFilterContext {
  tenantType?: 'merchant' | 'service_provider' | 'both' | null;
  can?: (permission: string) => boolean;
}

export function filterMenu(items: MenuItem[], ctx: MenuFilterContext): MenuItem[] {
  return items
    .filter((item) => {
      if (item.tenantTypes && ctx.tenantType && !item.tenantTypes.includes(ctx.tenantType)) {
        return false;
      }
      if (item.permission && ctx.can && !ctx.can(item.permission)) {
        return false;
      }
      return true;
    })
    .map((item) => (item.children ? { ...item, children: filterMenu(item.children, ctx) } : item));
}
