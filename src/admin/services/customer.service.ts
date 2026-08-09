import { customerApi } from '@/api/customer.api';
import type { Customer, PaginatedRequest } from '@/types';

export const customerService = {
  fetchAll: () => customerApi.fetchAll(),
  list: (params?: PaginatedRequest) => customerApi.list(params),
  getById: (id: string) => customerApi.getById(id),
  create: (payload: Omit<Customer, 'id'>) => customerApi.create(payload),
  update: (id: string, payload: Partial<Customer>) =>
    customerApi.update(id, payload),
  remove: (id: string) => customerApi.remove(id),
};
