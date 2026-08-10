import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  collapsed: boolean;
  toggleMode: () => void;
  setMode: (mode: ThemeMode) => void;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'light',
      collapsed: false,
      toggleMode: () => set({ mode: 'light' }),
      setMode: () => set({ mode: 'light' }),
      toggleCollapsed: () => set({ collapsed: !get().collapsed }),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    {
      name: STORAGE_KEYS.THEME,
    },
  ),
);
