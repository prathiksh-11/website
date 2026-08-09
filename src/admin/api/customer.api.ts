import { USE_MOCK } from '@/constants';
import { delay, MOCK_CUSTOMERS } from '@/mocks/data';
import type { Customer, PaginatedRequest, PaginatedResponse } from '@/types';
import { mapBackendCustomer } from '@/utils/entity-map';
import { filterBySearch, generateId, paginate } from '@/utils/query';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

let customers = [...MOCK_CUSTOMERS];

interface BackendListResponse {
  success?: boolean;
  data?: Record<string, unknown>[];
  message?: string;
}

/** Full list from backend — role scoping stays on server (super admin = all). */
const fetchAllFromBackend = async (): Promise<Customer[]> => {
  const { data } = await apiClient.get<BackendListResponse>(
    ENDPOINTS.CUSTOMERS.ROOT,
  );
  const rows = Array.isArray(data?.data) ? data.data : [];
  return rows.map((row) => mapBackendCustomer(row));
};

const applyLocalFilters = (
  list: Customer[],
  params: PaginatedRequest,
): Customer[] => {
  let mapped = filterBySearch(
    list as unknown as Record<string, unknown>[],
    params.search,
    ['name', 'email', 'phone', 'branchName'],
  ) as unknown as Customer[];

  if (params.status) {
    mapped = mapped.filter((c) => c.membershipStatus === params.status);
  }
  if (params.branchId) {
    mapped = mapped.filter((c) => c.branchId === params.branchId);
  }
  return mapped;
};

export const customerApi = {
  /** Fetch entire customer set assigned for the logged-in role. */
  fetchAll: async (): Promise<Customer[]> => {
    if (USE_MOCK) {
      await delay();
      return [...customers];
    }
    return fetchAllFromBackend();
  },

  list: async (
    params: PaginatedRequest = {},
  ): Promise<PaginatedResponse<Customer>> => {
    const all = await customerApi.fetchAll();
    return paginate(applyLocalFilters(all, params), params);
  },

  getById: async (id: string): Promise<Customer> => {
    const all = await customerApi.fetchAll();
    const found = all.find((c) => c.id === id);
    if (!found) throw { message: 'Customer not found', status: 404 };
    return found;
  },

  create: async (
    payload: Omit<Customer, 'id'>,
  ): Promise<Customer> => {
    if (USE_MOCK) {
      await delay();
      const created: Customer = { ...payload, id: generateId('c') };
      customers = [created, ...customers];
      return created;
    }
    throw {
      message: 'Create customer is not available on this API yet',
      status: 501,
    };
  },

  update: async (id: string, payload: Partial<Customer>): Promise<Customer> => {
    if (USE_MOCK) {
      await delay();
      customers = customers.map((c) => (c.id === id ? { ...c, ...payload } : c));
      const updated = customers.find((c) => c.id === id);
      if (!updated) throw { message: 'Customer not found', status: 404 };
      return updated;
    }
    throw {
      message: 'Update customer is not available on this API yet',
      status: 501,
    };
  },

  remove: async (id: string): Promise<void> => {
    if (USE_MOCK) {
      await delay();
      customers = customers.filter((c) => c.id !== id);
      return;
    }
    void id;
    throw {
      message: 'Delete customer is not available on this API yet',
      status: 501,
    };
  },
};
