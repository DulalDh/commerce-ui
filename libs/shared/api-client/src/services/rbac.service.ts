import { resource } from './resource';
import type { Role, Permission } from '@org/types';

export const rolesService = resource<Role>('/roles');
export const permissionsService = resource<Permission>('/permissions');
