import { subscriptionApi } from '@/api/subscription.api';
import type { PaginatedRequest, Subscription } from '@/types';

export const subscriptionService = {
  fetchAll: () => subscriptionApi.fetchAll(),
  list: (params?: PaginatedRequest) => subscriptionApi.list(params),
  getById: (id: string) => subscriptionApi.getById(id),
  create: (payload: Omit<Subscription, 'id'>) => subscriptionApi.create(payload),
  update: (id: string, payload: Partial<Subscription>) =>
    subscriptionApi.update(id, payload),
  remove: (id: string) => subscriptionApi.remove(id),
};
