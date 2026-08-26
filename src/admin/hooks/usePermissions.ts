import { FULL_ADMIN_PERMS, ROLE_PERMISSIONS } from '@/constants';
import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/types';

export const usePermissions = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role as UserRole | undefined;
  const isSuperAdmin = user?.roleId === 1 || role === 'Super Admin';

  const canAccess = (permission: string) => {
    if (permission === 'offers') {
      return isSuperAdmin;
    }
    if (!role) return false;
    if (isSuperAdmin) return true;
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  };

  return {
    role,
    isSuperAdmin,
    canAccess,
    permissions: isSuperAdmin
      ? [...FULL_ADMIN_PERMS]
      : role
        ? ROLE_PERMISSIONS[role]
        : [],
  };
};
