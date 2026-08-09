import { useQuery } from '@tanstack/react-query';
import { transactionApi } from '@/api/transaction.api';
import type { TransactionListParams } from '@/types';

export const useTransactions = (params: TransactionListParams = {}) =>
  useQuery({
    queryKey: ['transactions', params],
    queryFn: () => transactionApi.list(params),
    placeholderData: (prev) => prev,
  });
