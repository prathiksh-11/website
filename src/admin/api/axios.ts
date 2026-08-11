import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { STORAGE_KEYS } from '@/constants';

const baseURL = import.meta.env.VITE_API_BASE_URL as string;

export const apiClient = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message ?? error.message ?? 'Something went wrong';

    if (status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem('gym-admin-auth');

      // Import auth store state and reset cleanly to prevent redirect loops
      import('@/store/auth.store').then(({ useAuthStore }) => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          useAuthStore.setState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          if (!window.location.pathname.includes('/login')) {
            message.error('Session expired. Please sign in again.');
          }
        }
      });
    } else if (status === 403) {
      if (!window.location.pathname.includes('/login')) {
        message.error('You do not have permission to perform this action.');
      }
    } else if (status === 500) {
      message.error('Server error. Please try again later.');
    } else if (!error.response) {
      message.error('Network error. Check your connection.');
    }

    return Promise.reject({
      message: errorMessage,
      status,
      code: error.code,
    });
  },
);
