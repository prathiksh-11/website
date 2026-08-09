import { USE_MOCK } from '@/constants';
import { delay, MOCK_TRAINERS } from '@/mocks/data';
import type {
  PaginatedRequest,
  PaginatedResponse,
  Trainer,
  TrainerDetails,
} from '@/types';
import {
  mapBackendTrainer,
  mapBackendTrainerHistory,
} from '@/utils/entity-map';
import { filterBySearch, generateId, paginate } from '@/utils/query';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

let trainers = [...MOCK_TRAINERS];

interface BackendListResponse {
  success?: boolean;
  status?: boolean;
  data?: Record<string, unknown>[] | Record<string, unknown>;
  message?: string;
}

const isTrainerRole = (t: Trainer) =>
  t.roleId == null || t.roleId === 4 || /employee|trainer/i.test(t.roleName ?? '');

const fetchAllFromBackend = async (): Promise<Trainer[]> => {
  const { data } = await apiClient.get<BackendListResponse>(
    ENDPOINTS.TRAINERS.ROOT,
  );
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((row) => mapBackendTrainer(row)).filter(isTrainerRole);
};

const applyLocalFilters = (list: Trainer[], params: PaginatedRequest) => {
  let mapped = filterBySearch(
    list as unknown as Record<string, unknown>[],
    params.search,
    [
      'name',
      'phone',
      'specialization',
      'branchName',
      'roleName',
      'description',
      'trainerType',
    ],
  ) as unknown as Trainer[];

  if (params.status) {
    mapped = mapped.filter((t) => t.status === params.status);
  }
  if (params.branchId) {
    mapped = mapped.filter((t) => t.branchId === params.branchId);
  }
  return mapped;
};

export const trainerApi = {
  fetchAll: async (): Promise<Trainer[]> => {
    if (USE_MOCK) {
      await delay();
      return [...trainers];
    }
    return fetchAllFromBackend();
  },

  list: async (
    params: PaginatedRequest = {},
  ): Promise<PaginatedResponse<Trainer>> => {
    const all = await trainerApi.fetchAll();
    return paginate(applyLocalFilters(all, params), params);
  },

  getById: async (id: string): Promise<Trainer> => {
    const all = await trainerApi.fetchAll();
    const found = all.find((t) => t.id === id);
    if (!found) throw { message: 'Employee not found', status: 404 };
    return found;
  },

  /** POST /employee-details/ — session purchase history */
  getDetails: async (
    id: string,
    range?: { fromDate?: string; toDate?: string },
  ): Promise<TrainerDetails> => {
    const trainer = await trainerApi.getById(id);

    if (USE_MOCK) {
      await delay();
      return {
        trainer,
        summary: {
          totalSessionsTaken: 40,
          totalSessionsCompleted: 28,
          totalAmount: 48000,
          totalCustomers: 6,
        },
        customers: [],
      };
    }

    const { data } = await apiClient.post<BackendListResponse>(
      ENDPOINTS.TRAINERS.DETAILS,
      {
        employee_id: Number(id),
        from_date: range?.fromDate,
        to_date: range?.toDate,
      },
    );
    const raw = data?.data;
    if (!raw || Array.isArray(raw)) {
      return {
        trainer,
        summary: {
          totalSessionsTaken: 0,
          totalSessionsCompleted: 0,
          totalAmount: 0,
          totalCustomers: 0,
        },
        customers: [],
      };
    }
    return mapBackendTrainerHistory(trainer, raw);
  },

  create: async (payload: Omit<Trainer, 'id'>): Promise<Trainer> => {
    if (USE_MOCK) {
      await delay();
      const created: Trainer = {
        ...payload,
        id: generateId('t'),
        branchNames: payload.branchNames?.length
          ? payload.branchNames
          : [payload.branchName].filter(Boolean),
      };
      trainers = [created, ...trainers];
      return created;
    }

    await apiClient.post(ENDPOINTS.TRAINERS.CREATE, {
      name: payload.name,
      mobile: payload.phone,
      role_id: 4,
      type: payload.trainerType,
      gender: payload.gender,
      description: payload.description ?? payload.specialization,
      branch_id: payload.branchId ? [Number(payload.branchId)] : undefined,
    });

    return {
      ...payload,
      id: 'new',
      branchNames: payload.branchNames?.length
        ? payload.branchNames
        : [payload.branchName].filter(Boolean),
    };
  },

  update: async (id: string, payload: Partial<Trainer>): Promise<Trainer> => {
    if (USE_MOCK) {
      await delay();
      trainers = trainers.map((t) => (t.id === id ? { ...t, ...payload } : t));
      const updated = trainers.find((t) => t.id === id);
      if (!updated) throw { message: 'Employee not found', status: 404 };
      return updated;
    }

    const { data } = await apiClient.post<BackendListResponse>(
      ENDPOINTS.TRAINERS.UPDATE,
      {
        id: Number(id),
        name: payload.name,
        mobile: payload.phone,
        type: payload.trainerType,
        gender: payload.gender,
        description: payload.description ?? payload.specialization,
        branch_id: payload.branchId ? [Number(payload.branchId)] : undefined,
      },
    );
    const raw = data?.data;
    if (raw && !Array.isArray(raw)) return mapBackendTrainer(raw);
    return { ...(await trainerApi.getById(id)), ...payload };
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay();
      trainers = trainers.filter((t) => t.id !== id);
      return;
    }
    await apiClient.post(ENDPOINTS.TRAINERS.DELETE, { id: Number(id) });
  },
};
