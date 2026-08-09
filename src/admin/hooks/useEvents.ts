import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useMemo } from 'react';
import { eventService } from '@/services/event.service';
import type { GymEvent, PaginatedRequest } from '@/types';
import { filterBySearch, paginate } from '@/utils/query';

const EVENTS_QUERY_KEY = ['events', 'all'] as const;

export const useEventsAll = () =>
  useQuery({
    queryKey: EVENTS_QUERY_KEY,
    queryFn: () => eventService.fetchAll(),
    staleTime: 60_000,
  });

export const useEvents = (
  params: PaginatedRequest = {},
  branchNameById?: Record<string, string>,
) => {
  const query = useEventsAll();

  const page = useMemo(() => {
    const all = query.data ?? [];
    let filtered = filterBySearch(
      all as unknown as Record<string, unknown>[],
      params.search,
      ['title', 'branchName', 'type', 'location', 'description'],
    ) as unknown as GymEvent[];

    if (params.status) {
      filtered = filtered.filter((e) => e.status === params.status);
    }

    if (params.branchId) {
      const branchName = branchNameById?.[params.branchId];
      filtered = filtered.filter((e) => {
        if (e.branchIds.includes(params.branchId!)) return true;
        if (e.branchId === params.branchId) return true;
        if (!branchName) return false;
        return e.branchNames.some(
          (n) => n.toLowerCase() === branchName.toLowerCase(),
        );
      });
    }

    return paginate(filtered, {
      ...params,
      pageSize: params.pageSize ?? 12,
    });
  }, [query.data, params, branchNameById]);

  return {
    ...query,
    data: page,
  };
};

export const useEventMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['events'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: (payload: Omit<GymEvent, 'id'>) => eventService.create(payload),
    onSuccess: () => {
      message.success('Event created');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to create event');
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<GymEvent> }) =>
      eventService.update(id, payload),
    onSuccess: () => {
      message.success('Event updated');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to update event');
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => eventService.remove(id),
    onSuccess: () => {
      message.success('Event deleted');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to delete event');
    },
  });

  return { create, update, remove };
};
