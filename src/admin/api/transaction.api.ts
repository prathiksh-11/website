import { USE_MOCK } from '@/constants';
import { delay } from '@/mocks/data';
import type {
  PaymentTransaction,
  TransactionListParams,
  TransactionListResult,
} from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

interface BackendTransactionRow {
  id?: number | string;
  branch_id?: number | string | null;
  branch_name?: string | null;
  user_id?: number | string | null;
  user_name?: string | null;
  user_mobile?: string | null;
  type?: string;
  amount?: number | string;
  currency?: string;
  payment_status?: string;
  payment_method?: string | null;
  receipt?: string | null;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  item_name?: string | null;
  qty?: number | null;
  failure_reason?: string | null;
  paid_at?: string | null;
  created_at?: string | null;
}

interface BackendListResponse {
  success?: boolean;
  data?: {
    items?: BackendTransactionRow[];
    total?: number;
    page?: number;
    pageSize?: number;
    summary?: {
      paid_amount?: number;
      paid_count?: number;
      failed_count?: number;
      pending_count?: number;
    };
  };
}

const mapRow = (raw: BackendTransactionRow): PaymentTransaction => ({
  id: String(raw.id),
  branchId: raw.branch_id != null ? String(raw.branch_id) : undefined,
  branchName: raw.branch_name ? String(raw.branch_name) : undefined,
  userId: raw.user_id != null ? String(raw.user_id) : undefined,
  userName: raw.user_name ? String(raw.user_name) : undefined,
  userMobile: raw.user_mobile ? String(raw.user_mobile) : undefined,
  type: String(raw.type ?? ''),
  amount: Number(raw.amount ?? 0),
  currency: String(raw.currency ?? 'INR'),
  paymentStatus: String(raw.payment_status ?? 'pending'),
  paymentMethod: raw.payment_method ? String(raw.payment_method) : undefined,
  receipt: raw.receipt ? String(raw.receipt) : undefined,
  razorpayOrderId: raw.razorpay_order_id
    ? String(raw.razorpay_order_id)
    : undefined,
  razorpayPaymentId: raw.razorpay_payment_id
    ? String(raw.razorpay_payment_id)
    : undefined,
  itemName: raw.item_name ? String(raw.item_name) : undefined,
  qty: raw.qty != null ? Number(raw.qty) : undefined,
  failureReason: raw.failure_reason ? String(raw.failure_reason) : undefined,
  paidAt: raw.paid_at ? String(raw.paid_at) : undefined,
  createdAt: String(raw.created_at ?? new Date().toISOString()),
});

export const transactionApi = {
  list: async (
    params: TransactionListParams = {},
  ): Promise<TransactionListResult> => {
    if (USE_MOCK) {
      await delay(200);
      return {
        items: [],
        total: 0,
        page: 1,
        pageSize: params.pageSize ?? 20,
        summary: {
          paidAmount: 0,
          paidCount: 0,
          failedCount: 0,
          pendingCount: 0,
        },
      };
    }

    const { data } = await apiClient.get<BackendListResponse>(
      ENDPOINTS.TRANSACTIONS.ROOT,
      {
        params: {
          page: params.page ?? 1,
          pageSize: params.pageSize ?? 20,
          search: params.search || undefined,
          branch_id: params.branchId || undefined,
          type: params.type || undefined,
          payment_status: params.paymentStatus || params.status || undefined,
          start_date: params.startDate || undefined,
          end_date: params.endDate || undefined,
        },
      },
    );

    const payload = data?.data;
    return {
      items: (payload?.items ?? []).map(mapRow),
      total: Number(payload?.total ?? 0),
      page: Number(payload?.page ?? params.page ?? 1),
      pageSize: Number(payload?.pageSize ?? params.pageSize ?? 20),
      summary: {
        paidAmount: Number(payload?.summary?.paid_amount ?? 0),
        paidCount: Number(payload?.summary?.paid_count ?? 0),
        failedCount: Number(payload?.summary?.failed_count ?? 0),
        pendingCount: Number(payload?.summary?.pending_count ?? 0),
      },
    };
  },
};
