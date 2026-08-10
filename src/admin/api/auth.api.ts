import { USE_MOCK } from '@/constants';
import { delay, MOCK_USERS } from '@/mocks/data';
import type { AuthResponse, LoginPayload, User } from '@/types';
import {
  mapBackendProfile,
  mapBackendUser,
  normalizeMobile,
} from '@/utils/auth-map';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

interface BackendLoginResponse {
  success?: boolean;
  status?: boolean;
  message?: string;
  token: string;
  refreshToken?: string;
  user: Parameters<typeof mapBackendUser>[0];
}

interface BackendProfileResponse {
  success?: boolean;
  data: Parameters<typeof mapBackendProfile>[0];
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const mobile = normalizeMobile(payload.mobile);

    if (USE_MOCK) {
      await delay();
      const found = MOCK_USERS.find(
        (u) =>
          normalizeMobile(u.phone ?? '') === mobile &&
          u.password === payload.password,
      );
      if (!found) {
        throw { message: 'Invalid mobile or password', status: 401 };
      }
      if (
        found.role !== 'Super Admin' &&
        found.role !== 'Admin' &&
        found.role !== 'Branch Manager'
      ) {
        throw {
          message:
            'Access denied. Only Super Admin, Admin, or Manager can login here.',
          status: 403,
        };
      }
      const user: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatar: found.avatar,
        branchId: found.branchId,
        phone: found.phone,
      };
      return {
        token: `mock_jwt_${user.id}_${Date.now()}`,
        refreshToken: `mock_refresh_${user.id}`,
        user,
      };
    }

    const { data } = await apiClient.post<BackendLoginResponse>(
      ENDPOINTS.AUTH.LOGIN,
      {
        mobile,
        password: payload.password,
        ...(payload.fcmToken ? { fcm_token: payload.fcmToken } : {}),
      },
    );

    if (!data?.token || !data?.user) {
      throw {
        message: data?.message ?? 'Login failed',
        status: 401,
      };
    }

    return {
      token: data.token,
      refreshToken: data.refreshToken,
      user: mapBackendUser(data.user),
    };
  },

  logout: async (): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      return;
    }
    // Backend exposes GET /auth/logout
    await apiClient.get(ENDPOINTS.AUTH.LOGOUT);
  },

  me: async (): Promise<User> => {
    if (USE_MOCK) {
      await delay(200);
      const raw = localStorage.getItem('gym_admin_user');
      if (!raw) throw { message: 'Unauthorized', status: 401 };
      return JSON.parse(raw) as User;
    }

    const { data } = await apiClient.get<BackendProfileResponse>(
      ENDPOINTS.AUTH.ME,
    );
    if (!data?.data) {
      throw { message: 'Unable to load profile', status: 401 };
    }
    return mapBackendProfile(data.data);
  },
};
