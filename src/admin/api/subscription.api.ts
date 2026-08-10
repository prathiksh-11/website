import { USE_MOCK } from '@/constants';
import { delay, MOCK_SUBSCRIPTIONS } from '@/mocks/data';
import type { PaginatedRequest, PaginatedResponse, Subscription } from '@/types';
import {
  mapBackendSubscription,
  toBackendSubscriptionPayload,
} from '@/utils/entity-map';
import { filterBySearch, generateId, paginate } from '@/utils/query';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

let subscriptions = [...MOCK_SUBSCRIPTIONS];

interface BackendListResponse {
  success?: boolean;
  data?: Record<string, unknown>[] | Record<string, unknown>;
  message?: string;
}

const fetchAllFromBackend = async (): Promise<Subscription[]> => {
  const { data } = await apiClient.get<BackendListResponse>(
    ENDPOINTS.SUBSCRIPTIONS.ROOT,
  );
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((row) => mapBackendSubscription(row));
};

const applyLocalFilters = (
  list: Subscription[],
  params: PaginatedRequest,
) => {
  let mapped = filterBySearch(
    list as unknown as Record<string, unknown>[],
    params.search,
    ['planName', 'branchName', 'cycle'],
  ) as unknown as Subscription[];

  if (params.branchId) {
    mapped = mapped.filter((s) => s.branchId === params.branchId);
  }
  if (params.status) {
    // status filter reused for plan duration (cycle)
    mapped = mapped.filter(
      (s) => s.cycle.toLowerCase() === params.status!.toLowerCase(),
    );
  }
  return mapped;
};

export const subscriptionApi = {
  fetchAll: async (): Promise<Subscription[]> => {
    if (USE_MOCK) {
      await delay();
      return [...subscriptions];
    }
    return fetchAllFromBackend();
  },

  list: async (
    params: PaginatedRequest = {},
  ): Promise<PaginatedResponse<Subscription>> => {
    const all = await subscriptionApi.fetchAll();
    return paginate(applyLocalFilters(all, params), params);
  },

  getById: async (id: string): Promise<Subscription> => {
    const all = await subscriptionApi.fetchAll();
    const found = all.find((s) => s.id === id);
    if (!found) throw { message: 'Subscription not found', status: 404 };
    return found;
  },

  create: async (
    payload: Omit<Subscription, 'id'>,
  ): Promise<Subscription> => {
    if (USE_MOCK) {
      await delay();
      const created: Subscription = { ...payload, id: generateId('s') };
      subscriptions = [created, ...subscriptions];
      return created;
    }

    const { data } = await apiClient.post<BackendListResponse>(
      ENDPOINTS.SUBSCRIPTIONS.CREATE,
      toBackendSubscriptionPayload(payload),
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      throw {
        message: data?.message ?? 'Failed to create subscription',
        status: 500,
      };
    }
    return mapBackendSubscription(raw);
  },

  update: async (
    id: string,
    payload: Partial<Subscription>,
  ): Promise<Subscription> => {
    if (USE_MOCK) {
      await delay();
      subscriptions = subscriptions.map((s) =>
        s.id === id ? { ...s, ...payload } : s,
      );
      const updated = subscriptions.find((s) => s.id === id);
      if (!updated) throw { message: 'Subscription not found', status: 404 };
      return updated;
    }

    await apiClient.put(ENDPOINTS.SUBSCRIPTIONS.UPDATE, {
      ...toBackendSubscriptionPayload({ ...payload, id }),
    });

    return { ...(await subscriptionApi.getById(id)), ...payload, id };
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay();
      subscriptions = subscriptions.filter((s) => s.id !== id);
      return;
    }
    await apiClient.post(ENDPOINTS.SUBSCRIPTIONS.DELETE, { id: Number(id) });
  },
};
