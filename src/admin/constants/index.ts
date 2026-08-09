import type { TrainerType, UserRole } from '@/types';

export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'Game On';
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const TRAINER_TYPE_OPTIONS: { value: TrainerType; label: string }[] = [
  { value: 'general_trainer', label: 'General Trainer' },
  { value: 'pt_trainer', label: 'PT Trainer' },
];

export const trainerTypeLabel = (type?: TrainerType | string | null) => {
  if (!type) return '—';
  return (
    TRAINER_TYPE_OPTIONS.find((o) => o.value === type)?.label ??
    String(type).replace(/_/g, ' ')
  );
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
  'notifications',
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
    'notifications',
    'profile',
  ],
  Trainer: ['dashboard', 'sessions', 'customers', 'profile'],
  Receptionist: [
    'dashboard',
    'customers',
    'subscriptions',
    'sessions',
    'events',
    'profile',
  ],
};
