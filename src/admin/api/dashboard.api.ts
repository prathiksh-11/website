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
  selected_branch_id?: number | string | null;
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
  };

  return { summary };
};

export const dashboardApi = {
  getDashboard: async (branchId?: string): Promise<DashboardData> => {
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
      });
    }

    const dashRes = await apiClient.get<BackendDashboardResponse>(ENDPOINTS.DASHBOARD.ROOT, {
      params: branchId ? { branch_id: Number(branchId) } : undefined,
    });

    const payload =
      dashRes.data?.data ??
      (dashRes.data as unknown as BackendDashboardPayload);

    return mapBackendDashboard(payload);
  },
};
