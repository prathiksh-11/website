import type { TrainerType, UserRole } from '@/types';

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Game On';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const TRAINER_TYPE_OPTIONS: { value: TrainerType; label: string }[] = [
  { value: 'general_trainer', label: 'General Trainer' },
  { value: 'pt_trainer', label: 'PT Trainer' },
  { value: 'membership_coordinator', label: 'Membership Coordinator' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
];

const TRAINER_TYPE_ALIASES: Record<string, TrainerType> = {
  general_trainer: 'general_trainer',
  general: 'general_trainer',
  genral: 'general_trainer',
  genaral: 'general_trainer',
  genaral_trainer: 'general_trainer',
  pt_trainer: 'pt_trainer',
  pt: 'pt_trainer',
  pt_triner: 'pt_trainer',
  personal_trainer: 'pt_trainer',
  membership_coordinator: 'membership_coordinator',
  membership_corider: 'membership_coordinator',
  coordinator: 'membership_coordinator',
  receptionist: 'receptionist',
  recept: 'receptionist',
  reception: 'receptionist',
  admin: 'admin',
  administrator: 'admin',
  manager: 'manager',
  branch_manager: 'manager',
};

export const normalizeTrainerType = (
  type?: string | null,
  description?: string | null,
): TrainerType | undefined => {
  const key = String(type || '')
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_');
  if (TRAINER_TYPE_ALIASES[key]) return TRAINER_TYPE_ALIASES[key];

  const d = String(description || '').toLowerCase();
  if (
    d.includes('membership') ||
    d.includes('coordinator') ||
    d.includes('corider')
  ) {
    return 'membership_coordinator';
  }
  if (d.includes('reception') || d.includes('recept')) {
    return 'receptionist';
  }
  if (d.includes('branch manager') || (d.includes('manager') && !d.includes('membership'))) {
    return 'manager';
  }
  if (d.includes('admin')) {
    return 'admin';
  }
  if (
    d.includes('personal trainer') ||
    d.includes('pt trainer') ||
    /\bpt\b/.test(d)
  ) {
    return 'pt_trainer';
  }
  if (d.includes('general trainer') || d.includes('genaral trainer')) {
    return 'general_trainer';
  }
  return undefined;
};

/** Effective type for display/filter — uses type, description, then role_name */
export const resolveTrainerType = (
  trainer: {
    trainerType?: TrainerType | string | null;
    description?: string | null;
    roleName?: string | null;
  },
): TrainerType | undefined => {
  const fromFields = normalizeTrainerType(trainer.trainerType, trainer.description);
  if (fromFields) return fromFields;

  const role = String(trainer.roleName || '')
    .trim()
    .toLowerCase();
  if (role === 'admin') return 'admin';
  if (role === 'manager') return 'manager';

  return undefined;
};

export const trainerTypeLabel = (type?: TrainerType | string | null) => {
  if (!type) return '—';
  const normalized = normalizeTrainerType(type) ?? type;
  return (
    TRAINER_TYPE_OPTIONS.find((o) => o.value === normalized)?.label ??
    String(normalized).replace(/_/g, ' ')
  );
};

export const trainerTypeTagColor = (type?: TrainerType | string | null) => {
  switch (normalizeTrainerType(type) ?? type) {
    case 'pt_trainer':
      return 'orange';
    case 'membership_coordinator':
      return 'purple';
    case 'receptionist':
      return 'green';
    case 'admin':
      return 'geekblue';
    case 'manager':
      return 'gold';
    default:
      return 'blue';
  }
};

export const STORAGE_KEYS = {
  TOKEN: 'gym_admin_token',
  REFRESH_TOKEN: 'gym_admin_refresh_token',
  USER: 'gym_admin_user',
  THEME: 'gym_admin_theme',
} as const;

export const ROLES = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  BRANCH_MANAGER: 'Branch Manager',
  TRAINER: 'Trainer',
  RECEPTIONIST: 'Receptionist',
} as const satisfies Record<string, UserRole>;

/** Backend role_id / role_name → panel roles allowed to use this admin app */
export const ADMIN_PANEL_ROLE_IDS = [1, 2, 3] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 10;

export const STATUS_COLORS: Record<string, string> = {
  active: 'success',
  inactive: 'default',
  pending: 'warning',
  expired: 'error',
  cancelled: 'error',
  scheduled: 'processing',
  completed: 'success',
  no_show: 'warning',
};

/** Theme tokens — aligned with website brand. Do not hardcode elsewhere. */
export const THEME_TOKENS = {
  colorPrimary: '#ff5000',
  colorPrimaryHover: '#e04800',
  colorBgLayout: '#f7f8fb',
  colorBgContainer: '#ffffff',
  colorBgSoft: '#f1f3f7',
  colorText: '#16181f',
  colorTextSecondary: '#6f7685',
  colorBorder: 'rgba(22, 24, 31, 0.08)',
  colorBlush: '#fff0e8',
  colorMist: '#e8ecf2',
  borderRadius: 14,
  fontFamily: "'Outfit', system-ui, sans-serif",
  fontDisplay: "'Outfit', system-ui, sans-serif",
} as const;

const FULL_ADMIN_PERMS = [
  'dashboard',
  'customers',
  'trainers',
  'branches',
  'subscriptions',
  'sessions',
  'events',
  'reports',
  'transactions',
  'coupons',
  'notifications',
  'offers',
  'settings',
  'profile',
] as const;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'Super Admin': [...FULL_ADMIN_PERMS],
  Admin: [...FULL_ADMIN_PERMS],
  'Branch Manager': [
    'dashboard',
    'customers',
    'trainers',
    'subscriptions',
    'sessions',
    'events',
    'reports',
    'transactions',
    'coupons',
    'notifications',
    'offers',
    'profile',
  ],
  Trainer: ['dashboard', 'sessions', 'customers', 'profile'],
  Receptionist: [
    'dashboard',
    'customers',
    'subscriptions',
    'sessions',
    'events',
    'coupons',
    'offers',
    'profile',
  ],
};
