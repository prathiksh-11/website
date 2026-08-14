import type { UserActivityListParams, UserActivityListResult, UserActivitySession } from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

interface BackendActivityUser {
  user_id: number | string;
  name: string;
  mobile?: string | null;
  last_active: string;
  status: UserActivitySession['status'];
}

interface BackendActivityListResponse {
  success?: boolean;
  data?: {
    items: BackendActivityUser[];
    total: number;
    page: number;
    pageSize: number;
    scope?: 'all' | 'self';
  };
}

const mapSession = (row: BackendActivityUser): UserActivitySession => ({
  id: String(row.user_id),
  userId: String(row.user_id),
  name: row.name,
  mobile: row.mobile ?? undefined,
  lastActive: row.last_active,
  status: row.status,
});

export const activityApi = {
  list: async (params: UserActivityListParams = {}): Promise<UserActivityListResult> => {
    const { data } = await apiClient.get<BackendActivityListResponse>(
      ENDPOINTS.ACTIVITY.MY_ACTIVITY,
      {
        params: {
          page: params.page,
          pageSize: params.pageSize,
          startDate: params.startDate,
          endDate: params.endDate,
          search: params.search,
        },
      },
    );

    const payload = data?.data;
    return {
      items: (payload?.items ?? []).map(mapSession),
      total: payload?.total ?? 0,
      page: payload?.page ?? params.page ?? 1,
      pageSize: payload?.pageSize ?? params.pageSize ?? 20,
      scope: payload?.scope,
    };
  },
};
