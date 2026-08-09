import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@/api/auth.api';
import { STORAGE_KEYS } from '@/constants';
import type { LoginPayload, User } from '@/types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (payload) => {
        set({ isLoading: true });
        try {
          const response = await authApi.login(payload);
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
          if (response.refreshToken) {
            localStorage.setItem(
              STORAGE_KEYS.REFRESH_TOKEN,
              response.refreshToken,
            );
          }
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));
          set({
            token: response.token,
            user: response.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } finally {
          localStorage.removeItem(STORAGE_KEYS.TOKEN);
          localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER);
          set({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'gym-admin-auth',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
