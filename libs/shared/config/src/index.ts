export type { MenuItem } from './menu.types';
export { filterMenu } from './filterMenu';
export type { MenuFilterContext } from './filterMenu';

import tenantAdminMenu from './menus/tenant-admin.menu.json';
import superAdminMenu from './menus/super-admin.menu.json';
import storefrontMenu from './menus/storefront.menu.json';

export { tenantAdminMenu, superAdminMenu, storefrontMenu };
