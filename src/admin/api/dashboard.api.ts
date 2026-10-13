import { USE_MOCK } from '@/constants';
import type { DashboardData, DashboardSummary } from '@/types';
import { apiClient } from './axios';
import { ENDPOINTS } from './endpoints';

interface BackendDashboardPayload {
  total_employees?: number;
  total_branches?: number;
  total_revenue?: number;
  total_subscription_revenue?: number;
  total_pt_revenue?: number;
  yesterday_revenue?: number;
  today_revenue?: number;
  today_pt_revenue?: number;
  today_subscription_revenue?: number;
  filtered_revenue?: number;
  filtered_pt_revenue?: number;
  filtered_subscription_revenue?: number;
  filter_date?: string | null;
  filter_start_date?: string | null;
  filter_end_date?: string | null;
  selected_branch_id?: number | string | null;
}

export interface DashboardDateParams {
  date?: string;
  startDate?: string;
  endDate?: string;
  allTime?: boolean;
}

interface BackendDashboardResponse {
  success?: boolean;
  data?: BackendDashboardPayload;
}

export const mapBackendDashboard = (
  payload: BackendDashboardPayload | undefined | null,
): DashboardData => {
  const totalSub = Number(payload?.total_subscription_revenue ?? 0);
  const totalPt = Number(payload?.total_pt_revenue ?? 0);
  const totalRevenue = Number(payload?.total_revenue ?? (totalSub + totalPt));

  const summary: DashboardSummary = {
    totalEmployees: Number(payload?.total_employees ?? 0),
    totalBranches: Number(payload?.total_branches ?? 0),
    totalRevenue,
    totalSubscriptionRevenue: totalSub,
    totalPtRevenue: totalPt,
    yesterdayRevenue: Number(payload?.yesterday_revenue ?? 0),
    todayRevenue: Number(payload?.today_revenue ?? 0),
    todayPtRevenue: Number(payload?.today_pt_revenue ?? 0),
    todaySubscriptionRevenue: Number(payload?.today_subscription_revenue ?? 0),
    filteredRevenue:
      payload?.filtered_revenue !== undefined
        ? Number(payload.filtered_revenue)
        : Number(payload?.today_revenue ?? 0),
    filteredPtRevenue:
      payload?.filtered_pt_revenue !== undefined
        ? Number(payload.filtered_pt_revenue)
        : Number(payload?.today_pt_revenue ?? 0),
    filteredSubscriptionRevenue:
      payload?.filtered_subscription_revenue !== undefined
        ? Number(payload.filtered_subscription_revenue)
        : Number(payload?.today_subscription_revenue ?? 0),
    filterDate: payload?.filter_date ?? null,
    filterStartDate: payload?.filter_start_date ?? null,
    filterEndDate: payload?.filter_end_date ?? null,
  };

  return { summary };
};

export const dashboardApi = {
  getDashboard: async (
    branchId?: string,
    dateParams?: DashboardDateParams,
  ): Promise<DashboardData> => {
    if (USE_MOCK) {
      return mapBackendDashboard({
        total_employees: 12,
        total_branches: 4,
        total_subscription_revenue: 150000,
        total_pt_revenue: 85000,
        yesterday_revenue: 12000,
        today_revenue: 18500,
        today_pt_revenue: 8500,
        today_subscription_revenue: 10000,
        filtered_revenue: 18500,
        filtered_pt_revenue: 8500,
        filtered_subscription_revenue: 10000,
      });
    }

    const params: Record<string, string | number | boolean> = {};
    if (branchId) params.branch_id = Number(branchId);
    if (dateParams?.date) params.date = dateParams.date;
    if (dateParams?.startDate) params.start_date = dateParams.startDate;
    if (dateParams?.endDate) params.end_date = dateParams.endDate;
    if (dateParams?.allTime) params.all_time = true;

    const dashRes = await apiClient.get<BackendDashboardResponse>(ENDPOINTS.DASHBOARD.ROOT, {
      params: Object.keys(params).length ? params : undefined,
    });

    const payload =
      dashRes.data?.data ??
      (dashRes.data as unknown as BackendDashboardPayload);

    return mapBackendDashboard(payload);
  },
};
