import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  defaultBranchId: string | 'all';
  emailExpiryAlerts: boolean;
  dailySessionSummary: boolean;
  eventAlerts: boolean;
  supportEmail: string;
  setDefaultBranchId: (id: string | 'all') => void;
  setEmailExpiryAlerts: (value: boolean) => void;
  setDailySessionSummary: (value: boolean) => void;
  setEventAlerts: (value: boolean) => void;
  setSupportEmail: (value: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      defaultBranchId: 'all',
      emailExpiryAlerts: true,
      dailySessionSummary: true,
      eventAlerts: true,
      supportEmail: 'support@gameonfitness.com',
      setDefaultBranchId: (defaultBranchId) => set({ defaultBranchId }),
      setEmailExpiryAlerts: (emailExpiryAlerts) => set({ emailExpiryAlerts }),
      setDailySessionSummary: (dailySessionSummary) =>
        set({ dailySessionSummary }),
      setEventAlerts: (eventAlerts) => set({ eventAlerts }),
      setSupportEmail: (supportEmail) => set({ supportEmail }),
    }),
    { name: 'gym_admin_settings' },
  ),
);
