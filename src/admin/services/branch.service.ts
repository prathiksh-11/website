import { branchApi } from '@/api/branch.api';
import type { Branch, PaginatedRequest } from '@/types';

export const branchService = {
  fetchAll: () => branchApi.fetchAll(),
  list: (params?: PaginatedRequest) => branchApi.list(params),
  getById: (id: string) => branchApi.getById(id),
  getDetails: (id: string) => branchApi.getDetails(id),
  create: (payload: Omit<Branch, 'id'>) => branchApi.create(payload),
  update: (id: string, payload: Partial<Branch>) => branchApi.update(id, payload),
  remove: (id: string) => branchApi.remove(id),
};
