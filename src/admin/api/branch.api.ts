import { USE_MOCK } from '@/constants';
import { delay, MOCK_BRANCHES } from '@/mocks/data';
import type {
  Branch,
  BranchDetails,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types';
import {
  mapBackendBranch,
  mapBackendBranchDetails,
} from '@/utils/entity-map';
import { filterBySearch, generateId, paginate } from '@/utils/query';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

let branches = [...MOCK_BRANCHES];

interface BackendListResponse {
  success?: boolean;
  data?: Record<string, unknown>[] | Record<string, unknown>;
  message?: string;
}

const fetchAllFromBackend = async (): Promise<Branch[]> => {
  const { data } = await apiClient.get<BackendListResponse>(
    ENDPOINTS.BRANCHES.ROOT,
  );
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((row) => mapBackendBranch(row));
};

const applyLocalFilters = (list: Branch[], params: PaginatedRequest) => {
  let mapped = filterBySearch(
    list as unknown as Record<string, unknown>[],
    params.search,
    ['name', 'code', 'city', 'managerName', 'phone', 'address'],
  ) as unknown as Branch[];

  if (params.status) {
    mapped = mapped.filter((b) => b.status === params.status);
  }
  return mapped;
};

export const branchApi = {
  fetchAll: async (): Promise<Branch[]> => {
    if (USE_MOCK) {
      await delay();
      return [...branches];
    }
    return fetchAllFromBackend();
  },

  list: async (
    params: PaginatedRequest = {},
  ): Promise<PaginatedResponse<Branch>> => {
    const all = await branchApi.fetchAll();
    return paginate(applyLocalFilters(all, params), params);
  },

  getById: async (id: string): Promise<Branch> => {
    const details = await branchApi.getDetails(id);
    return details;
  },

  /** GET /getbranchdetails/:id — full people + counts */
  getDetails: async (id: string): Promise<BranchDetails> => {
    if (USE_MOCK) {
      await delay();
      const found = branches.find((b) => b.id === id);
      if (!found) throw { message: 'Branch not found', status: 404 };
      return {
        ...found,
        counts: {
          customers: found.customerCount,
          employees: found.trainerCount,
          managers: found.managerName && found.managerName !== 'N/A' ? 1 : 0,
          admins: 0,
        },
        customers: [],
        employees: [],
        managers: [],
        admins: [],
      };
    }

    const { data } = await apiClient.get<BackendListResponse>(
      ENDPOINTS.BRANCHES.BY_ID(id),
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      throw { message: 'Branch not found', status: 404 };
    }
    return mapBackendBranchDetails(raw);
  },

  create: async (payload: Omit<Branch, 'id'>): Promise<Branch> => {
    if (USE_MOCK) {
      await delay();
      const created: Branch = { ...payload, id: generateId('b') };
      branches = [created, ...branches];
      return created;
    }

    const { data } = await apiClient.post<BackendListResponse>(
      ENDPOINTS.BRANCHES.CREATE,
      {
        name: payload.name,
        address: payload.address,
        phone: payload.phone,
        email: payload.email,
        opening_time: payload.openingTime,
        closing_time: payload.closingTime,
      },
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      throw { message: data?.message ?? 'Failed to create branch', status: 500 };
    }
    return mapBackendBranch(raw);
  },

  update: async (id: string, payload: Partial<Branch>): Promise<Branch> => {
    if (USE_MOCK) {
      await delay();
      branches = branches.map((b) => (b.id === id ? { ...b, ...payload } : b));
      const updated = branches.find((b) => b.id === id);
      if (!updated) throw { message: 'Branch not found', status: 404 };
      return updated;
    }

    const body: Record<string, unknown> = { id: Number(id) };
    if (payload.name !== undefined) body.name = payload.name;
    if (payload.address !== undefined) body.address = payload.address || null;
    if (payload.phone !== undefined) body.phone = payload.phone || null;
    if (payload.email !== undefined) body.email = payload.email || null;
    if (payload.status !== undefined) body.status = payload.status;
    if (payload.location !== undefined) body.location = payload.location || null;
    if (payload.openingTime !== undefined) {
      body.opening_time = payload.openingTime || null;
    }
    if (payload.closingTime !== undefined) {
      body.closing_time = payload.closingTime || null;
    }

    const { data } = await apiClient.post<BackendListResponse>(
      ENDPOINTS.BRANCHES.UPDATE,
      body,
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      return { ...(await branchApi.getDetails(id)) };
    }
    return mapBackendBranch(raw);
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay();
      branches = branches.filter((b) => b.id !== id);
      return;
    }
    await apiClient.post(ENDPOINTS.BRANCHES.DELETE, { id: Number(id) });
  },
};
