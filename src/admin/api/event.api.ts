import { USE_MOCK } from '@/constants';
import { delay, MOCK_EVENTS } from '@/mocks/data';
import type { GymEvent, PaginatedRequest, PaginatedResponse } from '@/types';
import { mapBackendEvent, toBackendEventPayload } from '@/utils/entity-map';
import { filterBySearch, generateId, paginate } from '@/utils/query';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

let events = [...MOCK_EVENTS];

interface BackendListResponse {
  success?: boolean;
  data?: Record<string, unknown>[] | Record<string, unknown>;
  message?: string;
}

const fetchAllFromBackend = async (): Promise<GymEvent[]> => {
  const { data } = await apiClient.get<BackendListResponse>(
    ENDPOINTS.EVENTS.ROOT,
  );
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((row) => mapBackendEvent(row));
};

const applyLocalFilters = (list: GymEvent[], params: PaginatedRequest) => {
  let mapped = filterBySearch(
    list as unknown as Record<string, unknown>[],
    params.search,
    ['title', 'branchName', 'type', 'location', 'description'],
  ) as unknown as GymEvent[];

  if (params.status) {
    mapped = mapped.filter((e) => e.status === params.status);
  }
  if (params.branchId) {
    mapped = mapped.filter(
      (e) =>
        e.branchId === params.branchId ||
        e.branchIds.includes(params.branchId!),
    );
  }
  return mapped;
};

export const eventApi = {
  fetchAll: async (): Promise<GymEvent[]> => {
    if (USE_MOCK) {
      await delay();
      return [...events];
    }
    return fetchAllFromBackend();
  },

  list: async (
    params: PaginatedRequest = {},
  ): Promise<PaginatedResponse<GymEvent>> => {
    const all = await eventApi.fetchAll();
    return paginate(applyLocalFilters(all, params), params);
  },

  getById: async (id: string): Promise<GymEvent> => {
    const all = await eventApi.fetchAll();
    const found = all.find((e) => e.id === id);
    if (!found) throw { message: 'Event not found', status: 404 };
    return found;
  },

  create: async (payload: Omit<GymEvent, 'id'>): Promise<GymEvent> => {
    if (USE_MOCK) {
      await delay();
      const created: GymEvent = {
        ...payload,
        id: generateId('e'),
        branchIds: payload.branchIds?.length
          ? payload.branchIds
          : [payload.branchId].filter(Boolean),
        branchNames: payload.branchNames?.length
          ? payload.branchNames
          : [payload.branchName].filter(Boolean),
      };
      events = [created, ...events];
      return created;
    }

    const { data } = await apiClient.post<BackendListResponse>(
      ENDPOINTS.EVENTS.CREATE,
      toBackendEventPayload(payload),
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      throw { message: data?.message ?? 'Failed to create event', status: 500 };
    }
    return mapBackendEvent(raw);
  },

  update: async (id: string, payload: Partial<GymEvent>): Promise<GymEvent> => {
    if (USE_MOCK) {
      await delay();
      events = events.map((e) => (e.id === id ? { ...e, ...payload } : e));
      const updated = events.find((e) => e.id === id);
      if (!updated) throw { message: 'Event not found', status: 404 };
      return updated;
    }

    const { data } = await apiClient.post<BackendListResponse>(
      ENDPOINTS.EVENTS.UPDATE,
      {
        id: Number(id),
        ...toBackendEventPayload(payload),
      },
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      return { ...(await eventApi.getById(id)), ...payload };
    }
    return mapBackendEvent(raw);
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay();
      events = events.filter((e) => e.id !== id);
      return;
    }
    await apiClient.post(ENDPOINTS.EVENTS.DELETE, { id: Number(id) });
  },
};
