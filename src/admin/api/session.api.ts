import { USE_MOCK } from '@/constants';
import { delay, MOCK_SESSIONS } from '@/mocks/data';
import type { PaginatedRequest, PaginatedResponse, PtSession } from '@/types';
import { mapBackendSession, toBackendSessionPayload } from '@/utils/entity-map';
import { filterBySearch, generateId, paginate } from '@/utils/query';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

let sessions = [...MOCK_SESSIONS];

interface BackendListResponse {
  success?: boolean;
  data?: Record<string, unknown>[] | Record<string, unknown>;
  message?: string;
}

const fetchAllFromBackend = async (): Promise<PtSession[]> => {
  const { data } = await apiClient.get<BackendListResponse>(
    ENDPOINTS.SESSIONS.ROOT,
  );
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((row) => mapBackendSession(row));
};

const applyLocalFilters = (list: PtSession[], params: PaginatedRequest) => {
  let mapped = filterBySearch(
    list as unknown as Record<string, unknown>[],
    params.search,
    ['name', 'sessionFeature', 'branchName'],
  ) as unknown as PtSession[];

  if (params.status) {
    mapped = mapped.filter((s) => s.status === params.status);
  }
  if (params.branchId) {
    mapped = mapped.filter((s) => s.branchId === params.branchId);
  }
  return mapped;
};

export const sessionApi = {
  fetchAll: async (): Promise<PtSession[]> => {
    if (USE_MOCK) {
      await delay();
      return [...sessions];
    }
    return fetchAllFromBackend();
  },

  list: async (
    params: PaginatedRequest = {},
  ): Promise<PaginatedResponse<PtSession>> => {
    const all = await sessionApi.fetchAll();
    return paginate(applyLocalFilters(all, params), params);
  },

  getById: async (id: string): Promise<PtSession> => {
    if (USE_MOCK) {
      await delay();
      const found = sessions.find((s) => s.id === id);
      if (!found) throw { message: 'Session not found', status: 404 };
      return found;
    }
    const { data } = await apiClient.get<BackendListResponse>(
      ENDPOINTS.SESSIONS.BY_ID(id),
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      throw { message: data?.message ?? 'Session not found', status: 404 };
    }
    return mapBackendSession(raw);
  },

  create: async (payload: Omit<PtSession, 'id'>): Promise<PtSession> => {
    if (USE_MOCK) {
      await delay();
      const created: PtSession = { ...payload, id: generateId('ps') };
      sessions = [created, ...sessions];
      return created;
    }

    const { data } = await apiClient.post<BackendListResponse>(
      ENDPOINTS.SESSIONS.CREATE,
      toBackendSessionPayload(payload),
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      throw { message: data?.message ?? 'Failed to create session', status: 500 };
    }
    return mapBackendSession(raw);
  },

  update: async (
    id: string,
    payload: Partial<PtSession>,
  ): Promise<PtSession> => {
    if (USE_MOCK) {
      await delay();
      sessions = sessions.map((s) => (s.id === id ? { ...s, ...payload } : s));
      const updated = sessions.find((s) => s.id === id);
      if (!updated) throw { message: 'Session not found', status: 404 };
      return updated;
    }

    const { data } = await apiClient.post<BackendListResponse>(
      ENDPOINTS.SESSIONS.UPDATE(id),
      toBackendSessionPayload(payload),
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      return { ...(await sessionApi.getById(id)), ...payload };
    }
    return mapBackendSession(raw);
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay();
      sessions = sessions.filter((s) => s.id !== id);
      return;
    }
    await apiClient.delete(ENDPOINTS.SESSIONS.DELETE(id));
  },
};
