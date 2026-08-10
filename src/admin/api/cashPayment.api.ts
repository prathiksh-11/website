import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

export interface CashPaymentPending {
  id: string;
  transactionId: string;
  branchId?: string;
  branchName?: string;
  customerId?: string;
  customerName: string;
  customerMobile?: string;
  trainerId?: string;
  trainerName: string;
  sessionId?: string;
  sessionName: string;
  amount: number;
  qty: number;
  paymentMethod?: string;
  paymentStatus?: string;
  isPartial?: boolean;
  packageAmount?: number;
  purchaseId?: string;
  createdAt?: string;
}

interface BackendCashRow {
  id?: number | string;
  transaction_id?: number | string;
  branch_id?: number | string | null;
  branch_name?: string | null;
  user_id?: number | string | null;
  customer_id?: number | string | null;
  customer_name?: string | null;
  customer_mobile?: string | null;
  trainer_id?: number | string | null;
  trainer_name?: string | null;
  session_id?: number | string | null;
  session_name?: string | null;
  amount?: number | string;
  qty?: number | string | null;
  payment_method?: string | null;
  payment_status?: string | null;
  is_partial?: boolean | null;
  package_amount?: number | string | null;
  purchase_id?: number | string | null;
  created_at?: string | null;
}

const mapRow = (raw: BackendCashRow): CashPaymentPending => {
  const id = String(raw.id ?? raw.transaction_id ?? '');
  return {
    id,
    transactionId: String(raw.transaction_id ?? raw.id ?? ''),
    branchId: raw.branch_id != null ? String(raw.branch_id) : undefined,
    branchName: raw.branch_name ? String(raw.branch_name) : undefined,
    customerId:
      raw.user_id != null
        ? String(raw.user_id)
        : raw.customer_id != null
          ? String(raw.customer_id)
          : undefined,
    customerName: String(raw.customer_name || 'Customer'),
    customerMobile: raw.customer_mobile
      ? String(raw.customer_mobile)
      : undefined,
    trainerId: raw.trainer_id != null ? String(raw.trainer_id) : undefined,
    trainerName: String(raw.trainer_name || 'Trainer'),
    sessionId: raw.session_id != null ? String(raw.session_id) : undefined,
    sessionName: String(raw.session_name || 'Session'),
    amount: Number(raw.amount ?? 0),
    qty: Number(raw.qty ?? 1),
    paymentMethod: raw.payment_method
      ? String(raw.payment_method)
      : undefined,
    paymentStatus: raw.payment_status
      ? String(raw.payment_status)
      : undefined,
    isPartial: Boolean(raw.is_partial),
    packageAmount:
      raw.package_amount != null ? Number(raw.package_amount) : undefined,
    purchaseId:
      raw.purchase_id != null ? String(raw.purchase_id) : undefined,
    createdAt: raw.created_at ? String(raw.created_at) : undefined,
  };
};

export const cashPaymentApi = {
  listPending: async (): Promise<CashPaymentPending[]> => {
    const { data } = await apiClient.get<{
      success?: boolean;
      data?: BackendCashRow[];
    }>(ENDPOINTS.CASH_PAYMENTS.PENDING);

    return (data?.data ?? []).map(mapRow);
  },

  approve: async (id: string): Promise<CashPaymentPending> => {
    const { data } = await apiClient.post<{
      success?: boolean;
      data?: BackendCashRow;
    }>(ENDPOINTS.CASH_PAYMENTS.APPROVE(id));
    return mapRow(data?.data ?? { id });
  },

  reject: async (id: string, reason?: string): Promise<CashPaymentPending> => {
    const { data } = await apiClient.post<{
      success?: boolean;
      data?: BackendCashRow;
    }>(ENDPOINTS.CASH_PAYMENTS.REJECT(id), {
      reason: reason || 'Rejected by staff',
    });
    return mapRow(data?.data ?? { id });
  },
};
