import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useMemo } from 'react';
import { trainerService } from '@/services/trainer.service';
import type { PaginatedRequest, Trainer } from '@/types';
import { filterBySearch, paginate } from '@/utils/query';

const TRAINERS_QUERY_KEY = ['trainers', 'all'] as const;

export const useTrainersAll = () =>
  useQuery({
    queryKey: TRAINERS_QUERY_KEY,
    queryFn: () => trainerService.fetchAll(),
    staleTime: 60_000,
  });

export const useTrainers = (
  params: PaginatedRequest = {},
  branchNameById?: Record<string, string>,
) => {
  const query = useTrainersAll();

  const page = useMemo(() => {
    const all = query.data ?? [];
    let filtered = filterBySearch(
      all as unknown as Record<string, unknown>[],
      params.search,
      ['name', 'phone', 'specialization', 'branchName', 'roleName', 'description'],
    ) as unknown as Trainer[];

    if (params.status) {
      filtered = filtered.filter((t) => t.status === params.status);
    }

    if (params.branchId) {
      const branchName = branchNameById?.[params.branchId];
      filtered = filtered.filter((t) => {
        if (t.branchId && t.branchId === params.branchId) return true;
        if (!branchName) return false;
        return t.branchNames.some(
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

export const useTrainerDetails = (
  id?: string | null,
  range?: { fromDate?: string; toDate?: string },
) =>
  useQuery({
    queryKey: ['trainers', 'details', id, range?.fromDate, range?.toDate],
    queryFn: () => trainerService.getDetails(id!, range),
    enabled: Boolean(id),
    staleTime: 30_000,
  });

export const useTrainerMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['trainers'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: (payload: Omit<Trainer, 'id'>) => trainerService.create(payload),
    onSuccess: () => {
      message.success('Employee created');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to create employee');
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Trainer> }) =>
      trainerService.update(id, payload),
    onSuccess: () => {
      message.success('Employee updated');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to update employee');
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => trainerService.remove(id),
    onSuccess: () => {
      message.success('Employee deleted');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to delete employee');
    },
  });

  return { create, update, remove };
};
