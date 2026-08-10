import { eventApi } from '@/api/event.api';
import type { GymEvent, PaginatedRequest } from '@/types';

export const eventService = {
  fetchAll: () => eventApi.fetchAll(),
  list: (params?: PaginatedRequest) => eventApi.list(params),
  getById: (id: string) => eventApi.getById(id),
  create: (payload: Omit<GymEvent, 'id'>) => eventApi.create(payload),
  update: (id: string, payload: Partial<GymEvent>) =>
    eventApi.update(id, payload),
  remove: (id: string) => eventApi.remove(id),
};
