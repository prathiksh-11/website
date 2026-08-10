import type { PaginatedRequest, PaginatedResponse } from '@/types';

export const paginate = <T>(
  items: T[],
  params: PaginatedRequest = {},
): PaginatedResponse<T> => {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const data = items.slice(start, start + pageSize);

  return {
    data,
    total: items.length,
    page,
    pageSize,
  };
};

export const filterBySearch = <T extends Record<string, unknown>>(
  items: T[],
  search?: string,
  fields: (keyof T)[] = [],
): T[] => {
  if (!search?.trim()) return items;
  const q = search.toLowerCase();
  return items.filter((item) =>
    fields.some((field) => String(item[field] ?? '').toLowerCase().includes(q)),
  );
};

export const generateId = (prefix: string): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
