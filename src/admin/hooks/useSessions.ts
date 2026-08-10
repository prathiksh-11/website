import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useMemo } from 'react';
import { sessionService } from '@/services/session.service';
import type { PaginatedRequest, PtSession } from '@/types';
import { filterBySearch, paginate } from '@/utils/query';

const SESSIONS_QUERY_KEY = ['sessions', 'all'] as const;

export const useSessionsAll = () =>
  useQuery({
    queryKey: SESSIONS_QUERY_KEY,
    queryFn: () => sessionService.fetchAll(),
    staleTime: 60_000,
  });

export const useSessions = (params: PaginatedRequest = {}) => {
  const query = useSessionsAll();

  const page = useMemo(() => {
    const all = query.data ?? [];
    let filtered = filterBySearch(
      all as unknown as Record<string, unknown>[],
      params.search,
      ['name', 'sessionFeature', 'branchName'],
    ) as unknown as PtSession[];

    if (params.status) {
      filtered = filtered.filter((s) => s.status === params.status);
    }
    if (params.branchId) {
      filtered = filtered.filter((s) => s.branchId === params.branchId);
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

export const useSessionMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['sessions'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: (payload: Omit<PtSession, 'id'>) => sessionService.create(payload),
    onSuccess: () => {
      message.success('Session created');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to create session');
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PtSession> }) =>
      sessionService.update(id, payload),
    onSuccess: () => {
      message.success('Session updated');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to update session');
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => sessionService.remove(id),
    onSuccess: () => {
      message.success('Session deleted');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to delete session');
    },
  });

  return { create, update, remove };
};
