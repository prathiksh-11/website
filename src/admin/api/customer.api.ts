import { USE_MOCK } from '@/constants';
import { delay, MOCK_CUSTOMERS } from '@/mocks/data';
import type {
  Customer,
  CustomerDetailsApiResponse,
  CustomerFullDetails,
  PaginatedRequest,
  PaginatedResponse,
} from '@/types';
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

  getDetails: async (id: string): Promise<CustomerFullDetails> => {
    if (USE_MOCK) {
      await delay();
      const customer = customers.find((c) => c.id === id);
      return {
        id: id,
        name: customer?.name ?? 'Rajitha Nair',
        phone: customer?.phone ?? '8971969057',
        email: customer?.email ?? '',
        membership_type: 'Level 1 PT 12 session ',
        status: customer?.membershipStatus ?? 'active',
        last_visit: '2026-08-10',
        joined_on: customer?.joinDate ?? '2026-08-03',
        branch_name: customer?.branchName ?? 'Game On Fitness Luxury Club - Kasavanahalli',
        profile_image_url: customer?.avatar ?? null,
        subscription: {
          plan_name: 'LEVEL 1 PT-12 SESSIONS',
          start_date: '2026-08-09',
          end_date: '2026-09-09',
          amount: '1.00',
          status: 'active',
          billing_cycle: 'Monthly',
        },
        session_plan: {
          plan_name: 'Level 1 PT 12 session ',
          total_sessions: 12,
          used_sessions: 1,
          price: '2256',
          purchased_on: '2026-08-09',
          status: 'active',
        },
        session_plans: [
          {
            plan_name: 'Level 1 PT 12 session ',
            total_sessions: 12,
            used_sessions: 1,
            price: '2256',
            purchased_on: '2026-08-09',
            status: 'active',
          },
        ],
        remaining_sessions: 11,
        payment_due: 0,
        payment_due_note: null,
        attendance_history: [
          {
            id: '121',
            session_name: 'Level 1 PT 12 session ',
            date: '2026-08-10',
            time: '11:07',
            trainer: 'Chandra l',
            status: 'attended',
          },
        ],
      };
    }

    const { data } = await apiClient.get<CustomerDetailsApiResponse>(
      ENDPOINTS.CUSTOMERS.DETAILS(id),
    );
    if (data?.CustomerDetails) {
      return data.CustomerDetails;
    }
    return (data as unknown as { CustomerDetails: CustomerFullDetails })?.CustomerDetails ?? (data as unknown as CustomerFullDetails);
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
