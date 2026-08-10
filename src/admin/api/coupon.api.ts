import dayjs from 'dayjs';
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

const COUPON_TTL_HOURS = 1;

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
  used_at?: string | Date | null;
  transaction_id?: number | string | null;
  status?: string;
  created_at?: string | Date | null;
  expires_at?: string | Date | null;
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

const toIso = (value?: string | Date | null) => {
  if (!value) return new Date().toISOString();
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
};

/** Effective expiry — backend expires_at, or created_at + 1 hour (never 1 day) */
export const getCouponExpiresAt = (
  coupon: Pick<Coupon, 'expiresAt' | 'createdAt'>,
) => {
  if (coupon.expiresAt) return coupon.expiresAt;
  return dayjs(coupon.createdAt).add(COUPON_TTL_HOURS, 'hour').toISOString();
};

/** Normalize status so past-due unused coupons show as expired in the UI */
export const resolveCouponStatus = (coupon: Coupon): string => {
  if (coupon.status === 'used' || coupon.usedBy) return 'used';
  if (coupon.status === 'expired') return 'expired';
  if (coupon.status === 'inactive') return 'inactive';

  const expiresAt = getCouponExpiresAt(coupon);
  if (dayjs(expiresAt).isBefore(dayjs())) return 'expired';

  return coupon.status || 'active';
};

const mapRow = (raw: BackendCouponRow): Coupon => {
  const createdAt = toIso(raw.created_at ?? new Date());
  const expiresAt = raw.expires_at
    ? toIso(raw.expires_at)
    : dayjs(createdAt).add(COUPON_TTL_HOURS, 'hour').toISOString();

  const mapped: Coupon = {
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
    usedAt: raw.used_at ? toIso(raw.used_at) : undefined,
    transactionId:
      raw.transaction_id != null ? String(raw.transaction_id) : undefined,
    status: String(raw.status ?? 'active'),
    createdAt,
    expiresAt,
  };

  return {
    ...mapped,
    status: resolveCouponStatus(mapped),
  };
};

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
    filtered = filtered.filter(
      (row) => resolveCouponStatus(row) === params.status,
    );
  }

  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
  const start = (page - 1) * pageSize;

  const withStatus = rows.map((r) => ({
    ...r,
    status: resolveCouponStatus(r),
  }));

  const summary = {
    total: withStatus.length,
    active: withStatus.filter((r) => r.status === 'active').length,
    used: withStatus.filter((r) => r.status === 'used').length,
    expired: withStatus.filter((r) => r.status === 'expired').length,
    totalValue: withStatus.reduce(
      (sum, r) => sum + (Number.isFinite(r.price) ? r.price : 0),
      0,
    ),
  };

  return {
    items: filtered
      .map((r) => ({ ...r, status: resolveCouponStatus(r) }))
      .slice(start, start + pageSize),
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
      const createdAt = new Date().toISOString();
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
        createdAt,
        expiresAt: dayjs(createdAt).add(COUPON_TTL_HOURS, 'hour').toISOString(),
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
