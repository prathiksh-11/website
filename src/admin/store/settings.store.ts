import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  defaultBranchId: string | 'all';
  pushEnabled: boolean;
  emailExpiryAlerts: boolean;
  dailySessionSummary: boolean;
  eventAlerts: boolean;
  setDefaultBranchId: (id: string | 'all') => void;
  setPushEnabled: (value: boolean) => void;
  setEmailExpiryAlerts: (value: boolean) => void;
  setDailySessionSummary: (value: boolean) => void;
  setEventAlerts: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultBranchId: 'all',
      pushEnabled: true,
      emailExpiryAlerts: true,
      dailySessionSummary: true,
      eventAlerts: true,
      setDefaultBranchId: (defaultBranchId) => set({ defaultBranchId }),
      setPushEnabled: (pushEnabled) => set({ pushEnabled }),
      setEmailExpiryAlerts: (emailExpiryAlerts) => set({ emailExpiryAlerts }),
      setDailySessionSummary: (dailySessionSummary) =>
        set({ dailySessionSummary }),
      setEventAlerts: (eventAlerts) => set({ eventAlerts }),
    }),
    { name: 'gym_admin_settings' },
  ),
);

export const getDefaultBranchFilter = () => {
  const id = useSettingsStore.getState().defaultBranchId;
  return !id || id === 'all' ? undefined : id;
};

/** Whether a live/push notification should surface in this admin session. */
export const allowsNotificationType = (type?: string) => {
  const {
    pushEnabled,
    emailExpiryAlerts,
    dailySessionSummary,
    eventAlerts,
  } = useSettingsStore.getState();

  if (!pushEnabled) return false;

  const t = String(type || '').toLowerCase();
  if (!t) return true;
  if (t.includes('cash_payment')) return true;
  if (t.includes('subscription') || t.includes('expiry')) {
    return emailExpiryAlerts;
  }
  if (
    t.includes('session') ||
    t.includes('attendance') ||
    t.includes('pt_')
  ) {
    return dailySessionSummary;
  }
  if (t.includes('event')) return eventAlerts;
  return true;
};
