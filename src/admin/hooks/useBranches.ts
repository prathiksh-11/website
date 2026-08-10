import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useMemo } from 'react';
import { branchService } from '@/services/branch.service';
import type { Branch, PaginatedRequest } from '@/types';
import { filterBySearch, paginate } from '@/utils/query';

const BRANCHES_QUERY_KEY = ['branches', 'all'] as const;

export const useBranchesAll = () =>
  useQuery({
    queryKey: BRANCHES_QUERY_KEY,
    queryFn: () => branchService.fetchAll(),
    staleTime: 60_000,
  });

export const useBranches = (params: PaginatedRequest = {}) => {
  const query = useBranchesAll();

  const page = useMemo(() => {
    const all = query.data ?? [];
    let filtered = filterBySearch(
      all as unknown as Record<string, unknown>[],
      params.search,
      ['name', 'code', 'city', 'managerName', 'phone', 'address'],
    ) as unknown as Branch[];

    if (params.status) {
      filtered = filtered.filter((b) => b.status === params.status);
    }

    return paginate(filtered, {
      ...params,
      pageSize: params.pageSize ?? 100,
    });
  }, [query.data, params]);

  return {
    ...query,
    data: page,
  };
};

export const useBranchDetails = (id?: string | null) =>
  useQuery({
    queryKey: ['branches', 'details', id],
    queryFn: () => branchService.getDetails(id!),
    enabled: Boolean(id),
    staleTime: 30_000,
  });

export const useBranchMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['branches'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: (payload: Omit<Branch, 'id'>) => branchService.create(payload),
    onSuccess: () => {
      message.success('Branch created');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to create branch');
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Branch> }) =>
      branchService.update(id, payload),
    onSuccess: () => {
      message.success('Branch updated');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to update branch');
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => branchService.remove(id),
    onSuccess: () => {
      message.success('Branch deleted');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to delete branch');
    },
  });

  return { create, update, remove };
};
