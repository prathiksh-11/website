import { USE_MOCK } from '@/constants';
import { delay } from '@/mocks/data';
import type {
  PaymentTransaction,
  TransactionListParams,
  TransactionListResult,
  TransactionSettlement,
  TransactionTransferError,
} from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

interface BackendTransferError {
  code?: string | null;
  reason?: string | null;
  description?: string | null;
}

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
  subscription_id?: number | string | null;
  session_id?: number | string | null;
  event_id?: number | string | null;
  trainer_id?: number | string | null;
  trainer_name?: string | null;
  trainer_mobile?: string | null;
  raised_by?: number | string | null;
  raised_by_name?: string | null;
  failure_reason?: string | null;
  paid_at?: string | null;
  approved_by?: number | string | null;
  approved_by_name?: string | null;
  approved_by_mobile?: string | null;
  approved_at?: string | null;
  is_partial?: boolean | null;
  package_amount?: number | string | null;
  purchase_id?: number | string | null;
  coupon_id?: number | string | null;
  coupon_code?: string | null;
  coupon_discount?: number | string | null;
  original_amount?: number | string | null;
  razorpay_transfer_id?: string | null;
  linked_account_id?: string | null;
  merchant_branch_name?: string | null;
  transfer_amount?: number | string | null;
  transfer_status?: string | null;
  settlement_status?: string | null;
  settlement_id?: string | null;
  on_hold?: boolean | null;
  on_hold_until?: string | null;
  settled_at?: string | null;
  settles_at?: string | null;
  settlement_utr?: string | null;
  settlement_hint?: string | null;
  transfer_error?: BackendTransferError | string | null;
  razorpay_fee?: number | string | null;
  razorpay_tax?: number | string | null;
  transfer_fees?: number | string | null;
  transfer_tax?: number | string | null;
  receiving_amount?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
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

interface BackendSettlementResponse {
  success?: boolean;
  data?: {
    routed?: boolean;
    from?: string | null;
    linked_account_id?: string | null;
    transfer_id?: string | null;
    transfer_amount?: number | string | null;
    transfer_status?: string | null;
    settlement_status?: string | null;
    settlement_id?: string | null;
    on_hold?: boolean | null;
    on_hold_until?: string | null;
    settled_at?: string | null;
    settles_at?: string | null;
    settlement_utr?: string | null;
    settlement_hint?: string | null;
    transfer_error?: BackendTransferError | string | null;
    razorpay_fee?: number | string | null;
    razorpay_tax?: number | string | null;
    transfer_fees?: number | string | null;
    transfer_tax?: number | string | null;
    receiving_amount?: number | string | null;
    payment_id?: string | null;
    order_id?: string | null;
    paid_amount?: number | string | null;
    branch_id?: number | string | null;
    branch_name?: string | null;
    merchant_branch_name?: string | null;
    payment_method?: string | null;
  };
  message?: string;
}

const optionalId = (value: number | string | null | undefined) =>
  value != null && value !== '' ? String(value) : undefined;

const optionalString = (value: unknown) =>
  value != null && value !== '' ? String(value) : undefined;

const optionalNumber = (value: number | string | null | undefined) =>
  value != null && value !== '' && !Number.isNaN(Number(value))
    ? Number(value)
    : undefined;

const mapTransferError = (
  raw: BackendTransferError | string | null | undefined,
): TransactionTransferError | undefined => {
  if (!raw) return undefined;
  if (typeof raw === 'string') {
    return { description: raw };
  }
  const description = optionalString(raw.description);
  const code = optionalString(raw.code);
  const reason = optionalString(raw.reason);
  if (!description && !code && !reason) return undefined;
  return { code, reason, description };
};

const mapRow = (raw: BackendTransactionRow): PaymentTransaction => ({
  id: String(raw.id),
  branchId: optionalId(raw.branch_id),
  branchName: raw.branch_name ? String(raw.branch_name) : undefined,
  userId: optionalId(raw.user_id),
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
  subscriptionId: optionalId(raw.subscription_id),
  sessionId: optionalId(raw.session_id),
  eventId: optionalId(raw.event_id),
  trainerId: optionalId(raw.trainer_id),
  trainerName: optionalString(raw.trainer_name),
  trainerMobile: optionalString(raw.trainer_mobile),
  raisedBy: optionalId(raw.raised_by),
  raisedByName: optionalString(raw.raised_by_name),
  failureReason: raw.failure_reason ? String(raw.failure_reason) : undefined,
  paidAt: raw.paid_at ? String(raw.paid_at) : undefined,
  approvedBy: optionalId(raw.approved_by),
  approvedByName: raw.approved_by_name
    ? String(raw.approved_by_name)
    : undefined,
  approvedByMobile: optionalString(raw.approved_by_mobile),
  approvedAt: raw.approved_at ? String(raw.approved_at) : undefined,
  isPartial: Boolean(raw.is_partial),
  packageAmount:
    raw.package_amount != null ? Number(raw.package_amount) : undefined,
  purchaseId: optionalId(raw.purchase_id),
  couponId: optionalId(raw.coupon_id),
  couponCode: raw.coupon_code ? String(raw.coupon_code) : undefined,
  couponDiscount:
    raw.coupon_discount != null ? Number(raw.coupon_discount) : undefined,
  originalAmount:
    raw.original_amount != null ? Number(raw.original_amount) : undefined,
  razorpayTransferId: raw.razorpay_transfer_id
    ? String(raw.razorpay_transfer_id)
    : undefined,
  linkedAccountId: raw.linked_account_id
    ? String(raw.linked_account_id)
    : undefined,
  merchantBranchName: optionalString(raw.merchant_branch_name),
  transferAmount: optionalNumber(raw.transfer_amount),
  transferStatus: raw.transfer_status ? String(raw.transfer_status) : undefined,
  settlementStatus: raw.settlement_status
    ? String(raw.settlement_status)
    : undefined,
  settlementId: raw.settlement_id ? String(raw.settlement_id) : undefined,
  onHold: Boolean(raw.on_hold),
  onHoldUntil: raw.on_hold_until ? String(raw.on_hold_until) : undefined,
  settledAt: raw.settled_at ? String(raw.settled_at) : undefined,
  settlesAt: raw.settles_at ? String(raw.settles_at) : undefined,
  settlementUtr: optionalString(raw.settlement_utr),
  settlementHint: optionalString(raw.settlement_hint),
  transferError: mapTransferError(raw.transfer_error),
  razorpayFee: optionalNumber(raw.razorpay_fee),
  razorpayTax: optionalNumber(raw.razorpay_tax),
  transferFees: optionalNumber(raw.transfer_fees),
  transferTax: optionalNumber(raw.transfer_tax),
  receivingAmount: optionalNumber(raw.receiving_amount),
  createdAt: String(raw.created_at ?? new Date().toISOString()),
  updatedAt: raw.updated_at ? String(raw.updated_at) : undefined,
});

const mapSettlement = (
  raw: BackendSettlementResponse['data'] = {},
): TransactionSettlement => ({
  routed: Boolean(raw?.routed),
  from: raw?.from ?? null,
  linkedAccountId: raw?.linked_account_id
    ? String(raw.linked_account_id)
    : null,
  transferId: raw?.transfer_id ? String(raw.transfer_id) : null,
  transferAmount: optionalNumber(raw?.transfer_amount) ?? null,
  transferStatus: raw?.transfer_status ? String(raw.transfer_status) : null,
  settlementStatus: raw?.settlement_status
    ? String(raw.settlement_status)
    : null,
  settlementId: raw?.settlement_id ? String(raw.settlement_id) : null,
  onHold: Boolean(raw?.on_hold),
  onHoldUntil: raw?.on_hold_until ? String(raw.on_hold_until) : null,
  settledAt: raw?.settled_at ? String(raw.settled_at) : null,
  settlesAt: raw?.settles_at ? String(raw.settles_at) : null,
  settlementUtr: optionalString(raw?.settlement_utr) ?? null,
  settlementHint: optionalString(raw?.settlement_hint) ?? null,
  transferError: mapTransferError(raw?.transfer_error) ?? null,
  razorpayFee: optionalNumber(raw?.razorpay_fee) ?? null,
  razorpayTax: optionalNumber(raw?.razorpay_tax) ?? null,
  transferFees: optionalNumber(raw?.transfer_fees) ?? null,
  transferTax: optionalNumber(raw?.transfer_tax) ?? null,
  receivingAmount: optionalNumber(raw?.receiving_amount) ?? null,
  paymentId: raw?.payment_id ? String(raw.payment_id) : null,
  orderId: raw?.order_id ? String(raw.order_id) : null,
  paidAmount: optionalNumber(raw?.paid_amount) ?? null,
  branchId: optionalId(raw?.branch_id) ?? null,
  branchName: raw?.branch_name ? String(raw.branch_name) : null,
  merchantBranchName: optionalString(raw?.merchant_branch_name) ?? null,
  paymentMethod: raw?.payment_method ? String(raw.payment_method) : null,
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

  getSettlement: async (id: string): Promise<TransactionSettlement> => {
    if (USE_MOCK) {
      await delay(200);
      return {
        routed: false,
        settlementHint: 'Not routed — mock mode',
      };
    }

    const { data } = await apiClient.get<BackendSettlementResponse>(
      ENDPOINTS.TRANSACTIONS.SETTLEMENT(id),
    );

    return mapSettlement(data?.data);
  },
};
