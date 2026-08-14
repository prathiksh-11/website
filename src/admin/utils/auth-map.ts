import type { User, UserRole } from '@/types';
import { ADMIN_PANEL_ROLE_IDS } from '@/constants';

interface BackendUser {
  id: number | string;
  name?: string;
  last_name?: string;
  mobile?: string;
  email?: string;
  image?: string;
  role_id?: number | null;
  role_name?: string | null;
  branch_id?: number[] | number | string | null;
  show_activity_dashboard?: boolean;
}

interface BackendProfile {
  id: number | string;
  name?: string;
  last_name?: string;
  mobile?: string;
  email?: string;
  image?: string;
  role?: { id?: number; name?: string } | null;
  branch?: { id?: number; name?: string } | null;
  show_activity_dashboard?: boolean;
}

const ROLE_NAME_MAP: Record<string, UserRole> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  manager: 'Branch Manager',
  employee: 'Trainer',
  trainer: 'Trainer',
};

const ROLE_ID_MAP: Record<number, UserRole> = {
  1: 'Super Admin',
  2: 'Admin',
  3: 'Branch Manager',
  4: 'Trainer',
};

export const mapBackendRole = (
  roleId?: number | null,
  roleName?: string | null,
): UserRole | null => {
  if (roleName) {
    const mapped = ROLE_NAME_MAP[roleName.toLowerCase()];
    if (mapped) return mapped;
  }
  if (roleId != null && ROLE_ID_MAP[Number(roleId)]) {
    return ROLE_ID_MAP[Number(roleId)];
  }
  return null;
};

export const isAdminPanelRole = (roleId?: number | null, roleName?: string | null) => {
  const id = Number(roleId);
  if (ADMIN_PANEL_ROLE_IDS.includes(id as (typeof ADMIN_PANEL_ROLE_IDS)[number])) {
    return true;
  }
  const name = String(roleName || '').toLowerCase();
  return name === 'super_admin' || name === 'admin' || name === 'manager';
};

const pickBranchId = (branchId: BackendUser['branch_id']) => {
  if (Array.isArray(branchId)) {
    return branchId[0] != null ? String(branchId[0]) : undefined;
  }
  if (branchId == null || branchId === '') return undefined;
  return String(branchId);
};

export const mapBackendUser = (raw: BackendUser): User => {
  const role = mapBackendRole(raw.role_id, raw.role_name);
  if (!role || !isAdminPanelRole(raw.role_id, raw.role_name)) {
    throw {
      message: 'Access denied. Only Super Admin, Admin, or Manager can login here.',
      status: 403,
    };
  }

  const fullName = [raw.name, raw.last_name].filter(Boolean).join(' ').trim();

  return {
    id: String(raw.id),
    name: fullName || 'Admin User',
    lastName: raw.last_name,
    email: raw.email,
    role,
    roleId: raw.role_id != null ? Number(raw.role_id) : undefined,
    phone: raw.mobile,
    avatar: raw.image || undefined,
    branchId: pickBranchId(raw.branch_id),
    showActivityDashboard: Boolean(raw.show_activity_dashboard),
  };
};

export const mapBackendProfile = (raw: BackendProfile): User => {
  const role = mapBackendRole(raw.role?.id, raw.role?.name);
  if (!role || !isAdminPanelRole(raw.role?.id, raw.role?.name)) {
    throw {
      message: 'Access denied. Only Super Admin, Admin, or Manager can use this panel.',
      status: 403,
    };
  }

  const fullName = [raw.name, raw.last_name].filter(Boolean).join(' ').trim();

  return {
    id: String(raw.id),
    name: fullName || 'Admin User',
    lastName: raw.last_name,
    email: raw.email,
    role,
    roleId: raw.role?.id != null ? Number(raw.role.id) : undefined,
    phone: raw.mobile,
    avatar: raw.image || undefined,
    branchId: raw.branch?.id != null ? String(raw.branch.id) : undefined,
    showActivityDashboard: Boolean(raw.show_activity_dashboard),
  };
};

export const normalizeMobile = (mobile: string) => {
  let value = mobile.trim().replace(/\s+/g, '');
  if (value.startsWith('+91')) value = value.slice(3);
  if (value.startsWith('91') && value.length === 12) value = value.slice(2);
  return value;
};
