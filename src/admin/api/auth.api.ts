import { STORAGE_KEYS, USE_MOCK } from '@/constants';
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

  checkMobile: async (
    mobile: string,
  ): Promise<{
    isRegistered: boolean;
    roleId?: number;
    roleName?: string;
    isSuperAdminOrAdmin: boolean;
    message?: string;
  }> => {
    const cleanMobile = normalizeMobile(mobile);
    if (USE_MOCK) {
      await delay(200);
      return {
        isRegistered: true,
        roleId: 1,
        roleName: 'Super Admin',
        isSuperAdminOrAdmin: true,
      };
    }

    try {
      const { data } = await apiClient.post<{
        success?: boolean;
        message?: string;
        status?: {
          status?: string;
          user?: {
            role_id?: number;
            role_name?: string;
            level?: number;
          };
        };
        user?: {
          role_id?: number;
          role_name?: string;
          level?: number;
        };
      }>(ENDPOINTS.AUTH.CHECK_MOBILE, { mobile: cleanMobile });

      if (!data?.success && data?.status == null) {
        return {
          isRegistered: false,
          isSuperAdminOrAdmin: false,
          message: data?.message ?? 'Mobile number not registered',
        };
      }

      const userData = data.status?.user ?? data.user;
      const roleId = userData?.role_id != null ? Number(userData.role_id) : undefined;
      const roleName = String(userData?.role_name || '').trim().toLowerCase();
      const level = userData?.level != null ? Number(userData.level) : undefined;

      const isSuperAdminOrAdmin =
        roleId === 1 ||
        roleId === 2 ||
        level === 1 ||
        level === 2 ||
        roleName === 'super admin' ||
        roleName === 'super_admin' ||
        roleName === 'admin';

      return {
        isRegistered: true,
        roleId,
        roleName: userData?.role_name,
        isSuperAdminOrAdmin,
      };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ??
        (err as { message?: string })?.message ??
        'Mobile number not registered';
      return {
        isRegistered: false,
        isSuperAdminOrAdmin: false,
        message: msg,
      };
    }
  },

  loginWithOtp: async (payload: {
    idToken: string;
    fcmToken?: string;
  }): Promise<AuthResponse> => {
    if (USE_MOCK) {
      await delay(300);
      const mockUser = MOCK_USERS[0] ?? {
        id: '1',
        name: 'Super Admin',
        role: 'Super Admin' as const,
        phone: '9999999999',
      };
      const user: User = {
        id: String(mockUser.id),
        name: mockUser.name,
        role: mockUser.role,
        phone: mockUser.phone,
      };
      return {
        token: `mock_jwt_otp_${Date.now()}`,
        refreshToken: 'mock_refresh_otp',
        user,
      };
    }

    const { data } = await apiClient.post<BackendLoginResponse>(
      ENDPOINTS.AUTH.VERIFY_OTP,
      {
        idToken: payload.idToken,
        ...(payload.fcmToken ? { fcm_token: payload.fcmToken } : {}),
      },
    );

    if (!data?.token) {
      throw {
        message: data?.message ?? 'OTP verification failed',
        status: 401,
      };
    }

    // Persist token so that immediate authApi.me() or subsequent requests work
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    if (data.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    }

    let user: User;
    if (data.user && (data.user.role_id != null || data.user.role_name)) {
      try {
        user = mapBackendUser(data.user);
      } catch {
        user = await authApi.me();
      }
    } else {
      user = await authApi.me();
    }

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));

    return {
      token: data.token,
      refreshToken: data.refreshToken,
      user,
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

  updateProfile: async (payload: {
    name?: string;
    lastName?: string;
    password?: string;
    image?: string;
  }): Promise<User> => {
    if (USE_MOCK) {
      await delay(200);
      const current = await authApi.me();
      const next: User = {
        ...current,
        name: [payload.name, payload.lastName].filter(Boolean).join(' ') || current.name,
        lastName: payload.lastName ?? current.lastName,
        avatar: payload.image ?? current.avatar,
      };
      localStorage.setItem('gym_admin_user', JSON.stringify(next));
      return next;
    }

    const body: Record<string, string> = {};
    if (payload.name?.trim()) body.name = payload.name.trim();
    if (payload.lastName != null) body.last_name = payload.lastName.trim();
    if (payload.password) body.password = payload.password;
    if (payload.image) body.image = payload.image;

    await apiClient.put(ENDPOINTS.AUTH.UPDATE_PROFILE, body);
    return authApi.me();
  },

  changePassword: async (password: string): Promise<void> => {
    if (USE_MOCK) {
      await delay(200);
      return;
    }
    try {
      const { data } = await apiClient.post<{
        status?: boolean;
        token?: string;
        refreshToken?: string;
      }>(ENDPOINTS.AUTH.SET_PASSWORD, { password });

      if (data?.token) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
        if (data.refreshToken) {
          localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
        }
      }
    } catch {
      // Fallback to updateProfile if set-password encounters an error
      await authApi.updateProfile({ password });
    }
  },
};
