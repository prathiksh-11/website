import { trainerApi } from '@/api/trainer.api';
import type { PaginatedRequest, Trainer } from '@/types';

export const trainerService = {
  fetchAll: () => trainerApi.fetchAll(),
  list: (params?: PaginatedRequest) => trainerApi.list(params),
  getById: (id: string) => trainerApi.getById(id),
  getDetails: (
    id: string,
    range?: { fromDate?: string; toDate?: string },
  ) => trainerApi.getDetails(id, range),
  create: (payload: Omit<Trainer, 'id'>) => trainerApi.create(payload),
  update: (id: string, payload: Partial<Trainer>) =>
    trainerApi.update(id, payload),
  remove: (id: string) => trainerApi.remove(id),
};
