import { USE_MOCK } from '@/constants';
import { delay } from '@/mocks/data';
import type {
  Coupon,
  CouponListParams,
  CouponListResult,
  CreateCouponPayload,
} from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

interface BackendCouponRow {
  id?: number | string;
  coupon_name?: string;
  coupon_code?: string;
  price?: number | string;
  branch_id?: number | string;
  branch_name?: string | null;
  created_by?: number | string;
  created_by_name?: string | null;
  used_by?: number | string | null;
  used_by_name?: string | null;
  status?: string;
  created_at?: string | null;
}

interface BackendListResponse {
  success?: boolean;
  data?: BackendCouponRow[];
  message?: string;
}

interface BackendCreateResponse {
  success?: boolean;
  data?: BackendCouponRow;
  message?: string;
}

const mapRow = (raw: BackendCouponRow): Coupon => ({
  id: String(raw.id),
  couponName: String(raw.coupon_name ?? ''),
  couponCode: String(raw.coupon_code ?? ''),
  price: Number(raw.price ?? 0),
  branchId: String(raw.branch_id ?? ''),
  branchName: raw.branch_name ? String(raw.branch_name) : '—',
  createdBy: String(raw.created_by ?? ''),
  createdByName: raw.created_by_name ? String(raw.created_by_name) : 'Unknown',
  usedBy: raw.used_by != null ? String(raw.used_by) : undefined,
  usedByName: raw.used_by_name ? String(raw.used_by_name) : undefined,
  status: String(raw.status ?? 'active'),
  createdAt: String(raw.created_at ?? new Date().toISOString()),
});

const filterAndPage = (
  rows: Coupon[],
  params: CouponListParams,
): CouponListResult => {
  const search = (params.search ?? '').trim().toLowerCase();
  let filtered = rows;

  if (search) {
    filtered = filtered.filter((row) =>
      [
        row.couponName,
        row.couponCode,
        row.branchName,
        row.createdByName,
        row.usedByName,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search)),
    );
  }

  if (params.branchId) {
    filtered = filtered.filter((row) => row.branchId === params.branchId);
  }

  if (params.status) {
    filtered = filtered.filter((row) => row.status === params.status);
  }

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const start = (page - 1) * pageSize;

  const summary = {
    total: rows.length,
    active: rows.filter((r) => r.status === 'active').length,
    used: rows.filter((r) => r.status === 'used' || Boolean(r.usedBy)).length,
    totalValue: rows.reduce((sum, r) => sum + (Number.isFinite(r.price) ? r.price : 0), 0),
  };

  return {
    items: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
    summary,
  };
};

export const couponApi = {
  list: async (params: CouponListParams = {}): Promise<CouponListResult> => {
    if (USE_MOCK) {
      await delay(200);
      return filterAndPage([], params);
    }

    const { data } = await apiClient.get<BackendListResponse>(
      ENDPOINTS.COUPONS.ROOT,
    );

    const rows = (data?.data ?? []).map(mapRow);
    return filterAndPage(rows, params);
  },

  create: async (payload: CreateCouponPayload): Promise<Coupon> => {
    if (USE_MOCK) {
      await delay(200);
      return {
        id: String(Date.now()),
        couponName: payload.couponName,
        couponCode: 'MOCKCODE',
        price: payload.price,
        branchId: payload.branchId,
        branchName: 'Mock Branch',
        createdBy: '1',
        createdByName: 'Admin',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
    }

    const { data } = await apiClient.post<BackendCreateResponse>(
      ENDPOINTS.COUPONS.CREATE,
      {
        coupon_name: payload.couponName,
        price: payload.price,
        branch_id: Number(payload.branchId),
      },
    );

    if (!data?.data) {
      throw new Error(data?.message ?? 'Failed to create coupon');
    }

    return mapRow(data.data);
  },
};
