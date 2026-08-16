import { customerApi } from '@/api/customer.api';
import type { Customer, PaginatedRequest } from '@/types';

export const customerService = {
  fetchAll: () => customerApi.fetchAll(),
  list: (params?: PaginatedRequest) => customerApi.list(params),
  getById: (id: string) => customerApi.getById(id),
  getDetails: (id: string) => customerApi.getDetails(id),
  create: (payload: Omit<Customer, 'id'>) => customerApi.create(payload),
  update: (id: string, payload: Partial<Customer>) =>
    customerApi.update(id, payload),
  remove: (id: string) => customerApi.remove(id),
  downloadSummaryReport: (params: {
    branchId?: string | number;
    fromDate?: string;
    toDate?: string;
  }) => customerApi.downloadSummaryReport(params),
  downloadDetailedReport: (params: {
    customerId: string | number;
    branchId?: string | number;
    fromDate?: string;
    toDate?: string;
  }) => customerApi.downloadDetailedReport(params),
};
