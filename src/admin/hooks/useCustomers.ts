import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useMemo } from 'react';
import { customerService } from '@/services/customer.service';
import type { Customer, PaginatedRequest } from '@/types';
import { filterBySearch, paginate } from '@/utils/query';

const CUSTOMERS_QUERY_KEY = ['customers', 'all'] as const;

export const useCustomersAll = () =>
  useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: () => customerService.fetchAll(),
    staleTime: 60_000,
  });

/** Full fetch once, then filter + paginate locally. */
export const useCustomers = (params: PaginatedRequest = {}) => {
  const query = useCustomersAll();

  const page = useMemo(() => {
    const all = query.data ?? [];
    let filtered = filterBySearch(
      all as unknown as Record<string, unknown>[],
      params.search,
      ['name', 'email', 'phone', 'branchName'],
    ) as unknown as Customer[];

    if (params.status) {
      filtered = filtered.filter((c) => c.membershipStatus === params.status);
    }
    if (params.branchId) {
      filtered = filtered.filter((c) => c.branchId === params.branchId);
    }

    return paginate(filtered, params);
  }, [query.data, params]);

  return {
    ...query,
    data: page,
  };
};

export const useCustomerDetails = (id?: string | null) =>
  useQuery({
    queryKey: ['customers', 'details', id],
    queryFn: () => customerService.getDetails(id!),
    enabled: Boolean(id),
    staleTime: 30_000,
  });

export const useCustomerMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ['customers'] });
    void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const create = useMutation({
    mutationFn: (payload: Omit<Customer, 'id'>) => customerService.create(payload),
    onSuccess: () => {
      message.success('Customer created');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to create customer');
    },
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Customer> }) =>
      customerService.update(id, payload),
    onSuccess: () => {
      message.success('Customer updated');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to update customer');
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => customerService.remove(id),
    onSuccess: () => {
      message.success('Customer deleted');
      invalidate();
    },
    onError: (error: { message?: string }) => {
      message.error(error.message ?? 'Failed to delete customer');
    },
  });

  return { create, update, remove };
};
