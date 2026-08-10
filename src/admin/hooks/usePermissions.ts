import { ROLE_PERMISSIONS } from '@/constants';
import { useAuthStore } from '@/store/auth.store';
import type { UserRole } from '@/types';

export const usePermissions = () => {
  const user = useAuthStore((s) => s.user);
  const role = user?.role as UserRole | undefined;

  const canAccess = (permission: string) => {
    if (!role) return false;
    return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
  };

  return { role, canAccess, permissions: role ? ROLE_PERMISSIONS[role] : [] };
};
