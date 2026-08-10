import { sessionApi } from '@/api/session.api';
import type { PaginatedRequest, PtSession } from '@/types';

export const sessionService = {
  fetchAll: () => sessionApi.fetchAll(),
  list: (params?: PaginatedRequest) => sessionApi.list(params),
  getById: (id: string) => sessionApi.getById(id),
  create: (payload: Omit<PtSession, 'id'>) => sessionApi.create(payload),
  update: (id: string, payload: Partial<PtSession>) =>
    sessionApi.update(id, payload),
  remove: (id: string) => sessionApi.remove(id),
};
