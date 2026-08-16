import { useMemo, useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { getDefaultBranchFilter } from '@/store/settings.store';
import type { PaginatedRequest } from '@/types';

export const useTableParams = (initial?: Partial<PaginatedRequest>) => {
  const [params, setParams] = useState<PaginatedRequest>(() => ({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    search: '',
    branchId: getDefaultBranchFilter(),
    ...initial,
  }));

  const handlers = useMemo(
    () => ({
      setSearch: (search: string) =>
        setParams((prev) => ({ ...prev, search, page: 1 })),
      setStatus: (status?: string) =>
        setParams((prev) => ({ ...prev, status, page: 1 })),
      setBranchId: (branchId?: string) =>
        setParams((prev) => ({ ...prev, branchId, page: 1 })),
      setTrainerType: (trainerType?: string) =>
        setParams((prev) => ({ ...prev, trainerType, page: 1 })),
      setPage: (page: number, pageSize?: number) =>
        setParams((prev) => ({
          ...prev,
          page,
          pageSize: pageSize ?? prev.pageSize,
        })),
      setParams,
    }),
    [],
  );

  return { params, ...handlers };
};
