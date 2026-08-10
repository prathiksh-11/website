import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useMemo } from 'react';
import { subscriptionService } from '@/services/subscription.service';
import type { PaginatedRequest, Subscription } from '@/types';
import { filterBySearch, paginate } from '@/utils/query';

const SUBSCRIPTIONS_QUERY_KEY = ['subscriptions', 'all'] as const;

export const useSubscriptionsAll = () =>
  useQuery({
    queryKey: SUBSCRIPTIONS_QUERY_KEY,
    queryFn: () => subscriptionService.fetchAll(),
    staleTime: 60_000,
  });

export const useSubscriptions = (params: PaginatedRequest = {}) => {
  const query = useSubscriptionsAll();

  const page = useMemo(() => {
    const all = query.data ?? [];
    let filtered = filterBySearch(
      all as unknown as Record<string, unknown>[],
      params.search,
      ['planName', 'branchName', 'cycle'],
    ) as unknown as Subscription[];

    if (params.branchId) {
      filtered = filtered.filter((s) => s.branchId === params.branchId);
    }
    if (params.status) {
      filtered = filtered.filter(
        (s) => s.cycle.toLowerCase() === params.status!.toLowerCase(),
      );
    }

    return paginate(filtered, {
      ...params,
      pageSize: params.pageSize ?? 12,
    });
  }, [query.data, params]);

  return {
    ...query,
    data: page,
  };
};

export const useSubscriptionMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: (payload: Omit<Subscription, 'id'>) =>
      subscriptionService.create(payload),
    onSuccess: () => {
      message.success('Subscription plan created');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to create subscription');
    },
  });

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<Subscription>;
    }) => subscriptionService.update(id, payload),
    onSuccess: () => {
      message.success('Subscription plan updated');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to update subscription');
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => subscriptionService.remove(id),
    onSuccess: () => {
      message.success('Subscription plan deleted');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to delete subscription');
    },
  });

  return { create, update, remove };
};
